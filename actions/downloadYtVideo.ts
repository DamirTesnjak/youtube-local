'use server';

import cp from 'child_process';
import readline from "readline";
import ytdl from '@distube/ytdl-core';
import {socket} from "@/util/socket";
import WriteStream = NodeJS.WriteStream;

type ITracker = {
    start: number;
    audio: { downloaded: number, total: number },
    video: { downloaded: number, total: number },
    merged: { frame?: number, speed?: string, fps?: number },
}

type IProgressbarHandle = NodeJS.Timeout | number | undefined;
type IArgs = { [x: string]: string };

export async function downloadYtVideo(formData: FormData, currentPath: string, uuid: string, downloadUuid: string) {
    const youtubeUrlVideo = formData.get('ytUrlVideo') as string;
    const videoName = formData.get('videoName') as string;

    const tracker: ITracker = {
        start: Date.now(),
        audio: { downloaded: 0, total: Infinity },
        video: { downloaded: 0, total: Infinity },
        merged: { frame: 0, speed: '0x', fps: 0 },
    };

    if (!youtubeUrlVideo) {
        return {
            success: false,
            errorMessage: 'You must specify a valid YouTube URL!',
        }
    }

    if (!videoName) {
        return {
            success: false,
            errorMessage: 'You must specify a valid video name!',
        }
    }

// Get audio and video streams
    const audio = ytdl(youtubeUrlVideo, { quality: 'highestaudio' })
      .on('progress', (_, downloaded, total) => {
          tracker.audio = { downloaded, total };
      });
    const video = ytdl(youtubeUrlVideo, { quality: 'highestvideo' })
      .on('progress', (_, downloaded, total) => {
          tracker.video = { downloaded, total };
      });

// Prepare the progress bar
    let progressbarHandle: IProgressbarHandle = undefined;
    const progressbarInterval = 1000;
    const showProgress = async () => {
        readline.cursorTo(process.stdout, 0);
        const toMB = (i: number) => (i / 1024 / 1024).toFixed(2);

        const progressData = {
            "videoName": `${videoName}.mkv`,
            "audioMessage": `${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed`,
            "audioMB": `${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB`,
            "audioProgressBar": (tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2),
            "videoMessage": `${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `,
            "videoMB": `${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB`,
            "videoProgressBar": (tracker.video.downloaded / tracker.video.total * 100).toFixed(2),
            "mergedMessage": `Merged | processing frame ${tracker.merged.frame} `,
            "mergedProcessing": `(at ${tracker.merged.fps} fps => ${tracker.merged.speed})`,
            "runningTimeMessage": `running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`
        }
        socket.emit('download', { uuid, downloadUuid, progressData } )
    };

    try {

        const ffmpegProcess = cp.spawn("./node_modules/ffmpeg-static/ffmpeg", [
            // Remove ffmpeg's console spamming
            '-loglevel', '8', '-hide_banner',
            // Redirect/Enable progress messages
            '-progress', 'pipe:3',
            // Set inputs
            '-i', 'pipe:4',
            '-i', 'pipe:5',
            // Map audio & video from streams
            '-map', '0:a',
            '-map', '1:v',
            // Keep encoding
            '-c:v', 'copy',
            // Define output file
            `${currentPath}/${videoName}.mkv`,
        ], {
            windowsHide: true,
            stdio: [
                /* Standard: stdin, stdout, stderr */
                'inherit', 'inherit', 'inherit',
                /* Custom: pipe:3, pipe:4, pipe:5 */
                'pipe', 'pipe', 'pipe',
            ],
        });
        ffmpegProcess.on('close', () => {
            console.log('done');
            socket.emit("downloadComplete", {downloadUuid, uuid})
            clearInterval(progressbarHandle);
        });

        // Link streams
        // FFmpeg creates the transformer streams and we just have to insert / read data

        if (ffmpegProcess.stdio[3]) {
            ffmpegProcess.stdio[3].on('data', chunk => {
                // Start the progress bar
                if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
                // Parse the param=value list returned by ffmpeg
                const lines = chunk.toString().trim().split('\n');
                const args: IArgs = {};
                for (const l of lines) {
                    const [key, value] = l.split('=');
                    args[key.trim()] = value.trim();
                }
                tracker.merged = args;
            });
        }

        if (ffmpegProcess.stdio[4]) {
            audio.pipe(ffmpegProcess.stdio[4] as WriteStream);
        }

        // @ts-ignore
        if (ffmpegProcess.stdio && ffmpegProcess.stdio[5]) {
            // @ts-ignore
            video.pipe(ffmpegProcess.stdio[5] as WriteStream);
        }
    } catch (_error) {
        return {
            success: false,
            errorMessage: `Failed to download video ${videoName}! Please try again later`,
        }
    }
}
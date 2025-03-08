'use server';

import cp from 'child_process';
import readline from "readline";
import ytdl from '@distube/ytdl-core';
import {socket} from "@/util/socket";

export async function downloadYtVideo(formData, currentPath: string, uuid: string, downloadUuid: string) {
    const youtubeUrlVideo = formData.get('ytUrlVideo');
    const downloadedVideoName = formData.get('downloadedVideoName');

    const tracker = {
        start: Date.now(),
        audio: { downloaded: 0, total: Infinity },
        video: { downloaded: 0, total: Infinity },
        merged: { frame: 0, speed: '0x', fps: 0 },
    };

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
    let progressbarHandle = null;
    const progressbarInterval = 1000;
    const showProgress = async () => {
        readline.cursorTo(process.stdout, 0);
        const toMB = i => (i / 1024 / 1024).toFixed(2);

        const progressData = {
            "videoName": `${downloadedVideoName}.mkv`,
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
        `${currentPath}/${downloadedVideoName}.mkv`,
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
        socket.emit("downloadComplete", { downloadUuid, uuid})
        clearInterval(progressbarHandle);
    });

    // Link streams
// FFmpeg creates the transformer streams and we just have to insert / read data
    ffmpegProcess.stdio[3].on('data', chunk => {
        // Start the progress bar
        if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
        // Parse the param=value list returned by ffmpeg
        const lines = chunk.toString().trim().split('\n');
        const args = {};
        for (const l of lines) {
            const [key, value] = l.split('=');
            args[key.trim()] = value.trim();
        }
        tracker.merged = args;
    });
    audio.pipe(ffmpegProcess.stdio[4]);
    video.pipe(ffmpegProcess.stdio[5]);
}
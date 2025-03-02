'use server';

import fs from 'fs';
import path from "path";
import cp from 'child_process';
import readline from "readline";
// import ffmpeg from "ffmpeg-static"
import ytdl from '@distube/ytdl-core';

let memoryStore = {};

export async function setMemoryCache(value) {
    memoryStore = { ...value };
}

export async function getMemoryCache() {
    return memoryStore;
}

export async function clearMemoryCache() {
    memoryStore = {};
}

export async function downloadYtVideo(formData) {
    console.log("formData", formData);
    const youtubeUrlVideo = formData.get('ytUrlVideo');
    const downloadedVideoName = formData.get('downloadedVideoName');

    const tracker = {
        start: Date.now(),
        audio: { downloaded: 0, total: Infinity },
        video: { downloaded: 0, total: Infinity },
        merged: { frame: 0, speed: '0x', fps: 0 },
    };

    if (!youtubeUrlVideo || youtubeUrlVideo.length === 0 || !ytdl.validateURL(youtubeUrlVideo)) {
        return {
            error: false,
            errorMessage: 'You must specify a valid Youtube video URL',
        }
    }

    const videoPath = path.resolve(`./${downloadedVideoName}.mp4`);

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

        process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
        process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

        process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
        process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);

        process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
        process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);

        process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
        readline.moveCursor(process.stdout, 0, -3);

        await setMemoryCache({
            "audioMessage": `${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed`,
            "audioMB": `(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`,
            "videoMessage": `${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `,
            "videoMB": `(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`,
            "mergedMessage": `Merged | processing frame ${tracker.merged.frame} `,
            "mergedProcessing": `(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`,
            "runningTimeMessage": `running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`
        });
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
        `./${downloadedVideoName}.mkv`,
    ], {
        windowsHide: true,
        stdio: [
            'inherit', 'inherit', 'inherit',
            'pipe', 'pipe', 'pipe',
        ],
    });

    ffmpegProcess.on('close', async() => {
        console.log('done');
        const memoryStore = await getMemoryCache();
        await setMemoryCache({
            ...memoryStore,
            finished: true,
        })
        // Cleanup
        process.stdout.write('\n\n\n\n');
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
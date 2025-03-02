'use client'

import {startTransition, useState, useEffect} from 'react';
import {clearMemoryCache, downloadYtVideo, getMemoryCache} from "@/actions/downloadYtVideo";

export default function VideoDownloadForm({}) {
    const [progressData, setProgressData] = useState({});
    const [progressStatus, setProgressStatus] = useState(false);


    useEffect(() => {
        if (progressStatus) {
            const interval = setInterval(async () => {
                const progressData = await getMemoryCache();
                setProgressData(progressData);

                if (progressData.finished) {
                    await clearMemoryCache();
                    clearInterval(interval);
                    setProgressStatus(false)
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [progressStatus]);



    function onSubmit(e) {
        e.preventDefault();
        const ytUrlVideo  = document.getElementById("ytUrlVideo")!;
        const downloadedVideoName  = document.getElementById("downloadedVideoName")!;

        const formData = new FormData();

        formData.append("ytUrlVideo", ytUrlVideo.value);
        formData.append("downloadedVideoName", downloadedVideoName.value);
        startTransition(
            async function () {
                const response = await downloadYtVideo(formData);
                setProgressStatus(true);
            }
        )
    }

    console.log('progressStatus', progressStatus)

    const displayProgressStatus = () => {
        return (
            <div>
                {progressData.audioMessage}
                {progressData.audioMB}
                {progressData.videoMessage}
                {progressData.videoMB}
                {progressData.mergedMessage}
                {progressData.mergedProcessing}
                {progressData.runningTimeMessage}
            </div>
        )
    }

    return (
        <div>
            <form id="downloadForm" onSubmit={(e) => onSubmit(e)}>
                <label>Youtube Url video address</label>
                <input id="ytUrlVideo"/>
                <label>Save video name</label>
                <input id="downloadedVideoName"/>
                <button type="submit">Download</button>
            </form>
            {progressStatus ? displayProgressStatus() : null}
        </div>

    )
}
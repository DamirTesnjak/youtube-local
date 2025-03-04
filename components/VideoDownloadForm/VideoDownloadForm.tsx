'use client'

import {startTransition, useState, useEffect} from 'react';
import {downloadYtVideo, getCache} from "@/actions/downloadYtVideo";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import {findIndex} from "lodash";

export default function VideoDownloadForm({uuid, currentPath} : {uuid: string, currentPath: string}) {
    const [progressData, setProgressData] = useState([]);
    const [progressStatus, setProgressStatus] = useState(false);
    const [downloadComplete, setDownloadComplte] = useState(false);

    useEffect(() => {
        if (progressStatus) {
            const interval = setInterval(async () => {
                const progressData = await getCache(uuid);
                if (progressData && progressData.length === 0) {
                    clearInterval(interval);
                    setProgressStatus(false);
                    setDownloadComplte(true);
                    setProgressData([])
                } else {
                    console.log(progressData);
                    setProgressData(progressData);
                    Cookies.set(uuid, JSON.stringify(progressData));
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
                if (currentPath) {
                    await downloadYtVideo(formData, currentPath, uuid, uuidv4());
                    setProgressStatus(true);
                }
            }
        )
    }

    const displayProgressStatus = () => {
        return progressData.map((progress) => {
            const progressKey = Object.keys(progress)[0];
            const progressInfo = progress[progressKey];
            return (
                <div>
                    {progressInfo.audioMessage}
                    {progressInfo.audioMB}
                    {progressInfo.videoMessage}
                    {progressInfo.videoMB}
                    {progressInfo.mergedMessage}
                    {progressInfo.mergedProcessing}
                    {progressInfo.runningTimeMessage}
                </div>
            )
        })
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
        { progressStatus && progressData && progressData.length > 0 ? displayProgressStatus() : null }
            {downloadComplete && (<div>Download complete</div>)}
        </div>

    )
}
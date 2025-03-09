'use client'

import {startTransition, useState, useEffect, FormEvent} from 'react';
import {downloadYtVideo} from "@/actions/downloadYtVideo";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import {useRouter} from "next/navigation";
import { socket } from "@/util/socket";

type IProgressInfo = {
    videoName: string;
    audioMessage?: string;
    audioMB?: string;
    audioProgressBar?: number;
    videoMessage?: string;
    videoProgressBar?: number;
    runningTimeMessage?: string;
    videoMB?: string;
    completed?: boolean;
}

export default function VideoDownloadForm({uuid, currentPath} : {uuid: string, currentPath: string }) {
    const router = useRouter();

    const [progressData, setProgressData] = useState([]);
    const [downloadComplete, setDownloadComplete] = useState(false);

    const handlerOpenWindowContentModal = () => {
        Cookies.set('modalOpen', "open");
        router.push(`/${uuid}`);
    }

    useEffect(() => {
        socket.on("progressData", (data) => {
            setProgressData(data);
        })

        addEventListener("beforeunload", () => {
            socket.emit("disconnect", { uuid: uuid })
            socket.disconnect()
        });

        return () => {
            socket.off("progressData")
        }
    }, []);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const ytUrlVideo  = document.getElementById("ytUrlVideo") as HTMLInputElement;
        const videoName  = document.getElementById("videoName") as HTMLInputElement;

        const formData = new FormData();

        formData.append("ytUrlVideo", ytUrlVideo.value);
        formData.append("videoName", videoName.value);

        if (ytUrlVideo && videoName) {
            startTransition(
                async function () {
                    if (currentPath) {
                        await downloadYtVideo(formData, currentPath, uuid, uuidv4());
                        setDownloadComplete(false)
                    }
                }
            )
        }
    }

    const displayProgressStatus = () => {
        return progressData && progressData.map((progress) => {
            const progressKey = Object.keys(progress)[0];
            const progressInfo: IProgressInfo = progress[progressKey];
            return (
                <div key={progressInfo.videoName} className="mt-3 p-3 rounded-sm border-1 border-gray-300 shadow-lg">
                    <div className="font-semibold">{progressInfo.videoName}</div>
                    { progressInfo.audioMessage && <div id="audioTrack" className="flex flex-col mb-2">
                        <span className="text-sm">Audio {progressInfo.audioMessage} | {progressInfo.audioMB}</span>
                        <ProgressBar percentage={progressInfo.audioProgressBar} />
                    </div> }
                    { progressInfo.videoMessage && <div id="videoTrack" className="flex flex-col mb-2">
                        <span className="text-sm">Video {progressInfo.videoMessage} | {progressInfo.videoMB}</span>
                        <ProgressBar percentage={progressInfo.videoProgressBar} />
                    </div> }
            { progressInfo.runningTimeMessage && <p className="text-sm">{progressInfo.runningTimeMessage}</p> }
                    { progressInfo.completed && <p className="text-sm">Complete</p> }
                </div>
            )
        })
    }

    return (
        <div className="sm:col-start-1 sm:col-end-1 md:col-start-1 md:col-end-1 lg:col-start-2 lg:col-end-3 flex flex-col gap-2">
            <form className="flex flex-row gap-3 items-end max-h-20" id="downloadForm" onSubmit={(e) => onSubmit(e)}>
                <div className="flex flex-col">
                    <label className="pt-2 pb-2 pl-3 pr-3 font-mono text-sm">Youtube Url video</label>
                    <input className="pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-100" id="ytUrlVideo"/>
                </div>
                <div className="flex flex-col">
                    <label className="pt-2 pb-2 pl-3 pr-3 font-mono text-sm">Video name</label>
                    <input className="pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-100" id="videoName"/>
                </div>
                <button
                    id="saveButton"
                    className="pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-950 text-white font-light font-stretch-semi-expanded cursor-pointer hover:bg-blue-600"
                    type="button"
                    onClick={() => handlerOpenWindowContentModal()}
                >
                    Save video to...
                </button>
                <button
                    id="downloadButton"
                    className="pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-950 text-white font-light font-stretch-semi-expanded cursor-pointer hover:bg-blue-600"
                    type="submit"
                >
                    Download
                </button>
                {downloadComplete && (<div>Download complete</div>)}
            </form>
            <div className="h-[80vh] overflow-y-scroll">
                { displayProgressStatus() }
            </div>
        </div>

    )
}
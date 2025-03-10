'use client'

import {startTransition, useState, FormEvent} from 'react';
import {downloadYtVideo} from "@/actions/downloadYtVideo";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import {useRouter} from "next/navigation";
import ProgressDisplay from "@/components/ProgressDisplay/ProgressDisplay";

export default function VideoDownloadForm({uuid, currentPath} : {uuid: string, currentPath: string }) {
    const router = useRouter();

    const [downloadComplete, setDownloadComplete] = useState(false);

    const handlerOpenWindowContentModal = () => {
        Cookies.set('modalOpen', "open");
        router.push(`/${uuid}`);
    }

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
                <ProgressDisplay uuid={uuid} />
            </div>
        </div>
    )
}
'use client'

import {useEffect, useState} from "react";
import {socket} from "@/util/socket";
import ProgressDisplayItem from "@/components/ProgressDisplay/ProgressDisplayItem/ProgressDisplayItem";

export type IProgressInfo = {
    videoName: string;
    audioMessage?: string;
    audioMB?: string;
    audioProgressBar?: number;
    videoMessage?: string;
    videoProgressBar?: number;
    runningTimeMessage?: string;
    videoMB?: string;
    completed?: boolean;
    path?: string;
    pid?: number;
    uuid?: string;
    downloadUuid?: string;
    canceledDownload?: boolean;
}

export default function ProgressDisplay({uuid}: { uuid: string }) {
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        socket.on("progressData", (data) => {
            setProgressData(data);
        })

        addEventListener("beforeunload", () => {
            socket.emit("disconnectUser", { uuid: uuid })
            socket.disconnect()
        });

        return () => {
            socket.off("progressData")
            socket.off("disconnectUser")
            socket.disconnect()
        }
    }, []);

    return progressData && progressData.map((progress) => {
        const progressKey = Object.keys(progress)[0];
        const progressInfo: IProgressInfo = progress[progressKey];
        return (
            <div key={progressInfo.videoName}>
                <ProgressDisplayItem progressInfo={progressInfo}/>
            </div>
        )
    })
}
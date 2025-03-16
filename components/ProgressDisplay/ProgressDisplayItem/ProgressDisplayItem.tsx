'use client'

import ProgressBar from "@/components/ProgressBar/ProgressBar";
import {IProgressInfo} from "@/components/ProgressDisplay/ProgressDisplay";
// import openFile from "@/actions/openFile";
import stopDownload from "@/actions/stopDownload";

export default function ProgressDisplayItem({ progressInfo, clientId }: { progressInfo: IProgressInfo, clientId: string}) {
    return (
      <div id={progressInfo.videoName} className="mt-3 p-3 rounded-sm border-1 border-gray-300 shadow-lg">
        {progressInfo.completed && <video width="320" height="240" controls>
          <source src={`http://localhost:4001/video?file=${progressInfo.path}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>}
        <span className="pr-3 font-semibold">{progressInfo.videoName}</span>
        <span>
                {progressInfo.completed && <button
                  className="w-30 pt-1 pb-1 pl-1 pr-1 rounded-sm bg-blue-950 text-white font-light font-stretch-semi-expanded cursor-pointer hover:bg-blue-600"
                  onClick={() => window.open(`http://localhost/hostMachine${progressInfo.path}`, "_blank")} // openFile(progressInfo.path as string)}
                >
                  Open video
                </button>}
          {!progressInfo.completed && <button
            className="w-40 pt-1 pb-1 pl-1 pr-1 rounded-sm bg-blue-950 text-white font-light font-stretch-semi-expanded cursor-pointer hover:bg-blue-600"
            onClick={() => stopDownload({
              pid: progressInfo.pid as number,
              uuid: progressInfo.uuid as string,
              downloadUuid: progressInfo.downloadUuid as string,
              clientId,
            })}
          >
            Cancel download
          </button>}
            </span>
        {progressInfo.audioMessage && <div id="audioTrack" className="flex flex-col mb-2">
          <span className="text-sm">Audio {progressInfo.audioMessage} | {progressInfo.audioMB}  </span>
          <ProgressBar percentage={progressInfo.audioProgressBar} />
        </div>}
        {progressInfo.videoMessage && <div id="videoTrack" className="flex flex-col mb-2">
          <span className="text-sm">Video {progressInfo.videoMessage} | {progressInfo.videoMB}</span>
          <ProgressBar percentage={progressInfo.videoProgressBar} />
        </div>}
        {progressInfo.runningTimeMessage && <p className="text-sm">{progressInfo.runningTimeMessage}</p>}
        {progressInfo.completed && <p className="mt-4 text-sm">Complete</p>}
        {progressInfo.canceledDownload && <p className="mt-4 text-sm">Download cancelled</p>}

      </div>
    )
};
'use server'

import ButtonBack from "@/components/ButtonBack/ButtonBack";
import WindowContentItems from "@/components/WindowContent/WindowContentItems/WindowContentItems";
import OkButton from "@/components/WindowContent/OkButton/OkButton";

export default async function WindowContent({ folderContent, currentPath, uuid }) {
    return (
        <div className="position: absolute z-10 h-[100vh] w-[100vw] flex justify-center items-center bg-gray-950/50 backdrop-blur-xs">
            <div className="p-3 grid grid-flow-row w-[50vw] bg-white">
                <div className="text-[25px] font-semibold">Select folder</div>
                <div className="flex gap-1.5 items-center">
                    <span className="h-auto"><ButtonBack currentPath={currentPath} uuid={uuid}/></span>
                    <span className="h-6 font-semibold">{`Selected folder: `}</span>
                    <span className="h-6 text-blue-950">{currentPath}</span>
                </div>
                <WindowContentItems folderContent={folderContent} uuid={uuid}/>
                <div className="mt-3 flex flex-row gap-2 max-h-10 justify-center" >
                    <OkButton uuid={uuid}/>
                </div>
            </div>
        </div>
    )
}
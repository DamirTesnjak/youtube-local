'use server'

import FolderItem from "@/components/FolderItem/FolderItem";

export default async function WindowContentItems({folderContent, uuid}) {
    return (
        <div className=" grid grid-flow-col grid-rows-5 gap-4 overflow-auto">
            {
                folderContent.map((item) => {
                    return (<FolderItem key={item.fileName} item={item} uuid={uuid}/>);
                })
            }
        </div>
    )
}
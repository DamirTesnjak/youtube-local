'use server'

import FolderItem from "@/components/FolderItem/FolderItem";
import {IFolderContent} from "@/components/WindowContent/WindowContent";

type IWindowContentItems = {
    folderContent: IFolderContent;
    uuid: string
};

export default async function WindowContentItems({folderContent, uuid}: IWindowContentItems ) {
    return (
        <div className=" grid grid-flow-col grid-rows-5 gap-4 overflow-auto m-2">
            {
                folderContent && folderContent.map((item) => {
                    return (
                        <div key={item.fileName as string}>
                            <FolderItem item={item} uuid={uuid}/>
                        </div>
                    )
                })
            }
        </div>
    )
}
'use server'

import FolderItem from "@/components/FolderItem/FolderItem";
import ButtonBack from "@/components/ButtonBack/ButtonBack";

export default async function WindowContent({ folderContent, currentPath, uuid }) {
    return (
        <div id="windowContent">
            <ButtonBack currentPath={currentPath} uuid={uuid}/>
            {
                folderContent.map((item) => {
                    return (<FolderItem key={item.fileName} item={item} uuid={uuid}/>);
                })
            }
            <button>Cancel</button>
            <button>OK</button>
        </div>
    )
}
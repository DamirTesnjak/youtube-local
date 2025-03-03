'use server'

import getFolderContent from "@/actions/getFolderContect";
import FolderItem from "@/components/FolderItem/FolderItem";
import { cookies } from 'next/headers';
import ButtonBack from "@/components/ButtonBack/ButtonBack";

export default async function WindowContent() {
    const cookieStore = await cookies();
    const uuid = cookieStore.get("uuid");
    const currentPath = cookieStore.get("currentPath")?.value;
    const result = await getFolderContent(currentPath);

    if (!result.success) {
        console.log("something went wrong");
    }

    return (
        <div id="windowContent">
            <ButtonBack currentPath={currentPath} />
            {
                result.folderContent.map((item) => {
                    return (<FolderItem key={item.fileName} item={item} uuid={uuid}/>);
                })
            }
            <button>Cancel</button>
            <button>OK</button>
        </div>
    )
}
'use client'

import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {Folder} from "@phosphor-icons/react/dist/ssr";

export default function FolderItem({item, uuid}) {
    const router = useRouter();

    const openFolder = (currentPath: string) => {
        Cookies.set('currentPath', currentPath);
        router.push(`/${uuid}`);
    }

    return (
        <button
            className="flex mr-2 ml-2 p-2 bg-gray-100 cursor-pointer"
            onClick={() => openFolder(item.filePath)}
        >
            <Folder size={32} weight="fill" color="orange"/>
            {item.fileName}
        </button>
    );
}
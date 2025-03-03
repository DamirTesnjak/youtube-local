'use client'

import DisplayIcon from "@/utils/displayIcon";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

export default function FolderItem({item, uuid}) {
    const router = useRouter();

    const openFolder = (currentPath: string) => {
        Cookies.set('currentPath', currentPath);
        router.push("/downloadVideo");
    }

    return (
        <button
            onClick={() => openFolder(item.filePath)}
        >
            <DisplayIcon fileName={item.fileName} />
            {item.fileName}
        </button>
    );
}
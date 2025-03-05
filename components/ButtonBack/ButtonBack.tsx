'use client'

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ButtonBack({currentPath, uuid}: {currentPath: string , uuid: string}) {
    const router = useRouter();

    const goBack = () => {
        let tempArr = currentPath?.split('/')
        tempArr = tempArr.slice(0, tempArr.length - 1)
        const prevFolderPath = tempArr?.join("/")
        Cookies.set('currentPath', prevFolderPath);
        router.push(`/${uuid}`);
    }
    return (
        <button className="mt-3 mb-3 w-25 pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-950 text-white font-light font-stretch-semi-expanded cursor-pointer hover:bg-blue-600" onClick={() => goBack()}>Go back</button>
    )
}
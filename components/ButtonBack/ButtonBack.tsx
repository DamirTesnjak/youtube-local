'use client'

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ButtonBack({currentPath}) {
    const router = useRouter();

    const goBack = () => {
        let tempArr = currentPath?.split('/')
        tempArr = tempArr.slice(0, tempArr.length - 1)
        const prevFolderPath = tempArr?.join("/")
        Cookies.set('currentPath', prevFolderPath);
        router.push("/downloadVideo");
    }
    return (
        <button onClick={() => goBack()}>Go back</button>
    )
}
'use client'

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Button from "@/components/Button/Button";

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
        <Button
            text="Go Back"
            type="button"
            onClick={() => goBack()}
        />
    )
}
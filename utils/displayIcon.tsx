import {
    FileAudio,
    FileImage,
    FileVideo,
    FileZip,
    Folder,
    HardDrive,
    FileText,
    File,
} from "@phosphor-icons/react/dist/ssr";

export default function DisplayIcon({ fileName }: { fileName: string }) {
    const extension = fileName?.split(".")[1];

    const icons = {
        hhd: <HardDrive size={32} weight="fill" />,
        folder: <Folder size={32} weight="fill" />,
        pdf: <FileText size={32} weight="fill" />,
        doc: <FileText size={32} weight="fill" />,
        jpg: <FileImage size={32} weight="fill" />,
        png: <FileImage size={32} weight="fill" />,
        mp3: <FileAudio size={32} weight="fill" />,
        mp4: <FileVideo size={32} weight="fill" />,
        zip: <FileZip size={32} weight="fill" />,
        default: <File size={32} weight="fill" />,
    };

    return icons[extension] || icons["default"];
}
import VideoDownloadForm from "@/components/VideoDownloadForm/VideoDownloadForm";
import WindowContent from "@/components/WindowContent/WindowContent";
import getFolderContent from "@/actions/getFolderContect";
import {cookies} from "next/headers";
import {YoutubeLogo} from "@phosphor-icons/react/dist/ssr";

export interface IParams {
    params: Promise<{
        uuid: string;
    }>;
}

export default async function DownloadVideo({ params }: IParams) {
    const { uuid } = await params;
    const cookieStore = await cookies();
    let currentPath = cookieStore.get("currentPath")?.value;
    const openModal = cookieStore.get("modalOpen")?.value;
    const result = await getFolderContent(currentPath);

    if (!result.success) {
        console.log('Error');

    }
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[100px_1fr_100px]">
        <div className="sm:col-start-1 sm:col-end-1 md:col-start-1 md:col-end-1 lg:col-start-2 lg:col-end-3 flex flex-row items-center">
            <span><YoutubeLogo size={64} weight="fill" color="red"/></span>
            <div>
                <span className="text-5xl font-semibold">Youtube</span>
                <span className="text-5xl font-semibold text-gray-400">Local</span>
            </div>
        </div>
      <VideoDownloadForm
          uuid={uuid}
          currentPath={result.currentPath}
      />
        {openModal === "open" && (<WindowContent
          uuid={uuid}
          folderContent={result.folderContent}
          currentPath={result.currentPath}
      />)}
    </div>
  );
}

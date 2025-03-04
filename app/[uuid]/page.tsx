import VideoDownloadForm from "@/components/VideoDownloadForm/VideoDownloadForm";
import WindowContent from "@/components/WindowContent/WindowContent";
import getFolderContent from "@/actions/getFolderContect";
import {cookies} from "next/headers";

export default async function DownloadVideo({params}) {
    const { uuid } = await params;
    const cookieStore = await cookies();
    let currentPath = cookieStore.get("currentPath")?.value;
    const result = await getFolderContent(currentPath);

    if (!result.success) {
        console.log('Error');

    }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <VideoDownloadForm
          uuid={uuid}
          currentPath={result.currentPath}
      />
      <WindowContent
          uuid={uuid}
          folderContent={result.folderContent}
          currentPath={result.currentPath}
      />
    </div>
  );
}

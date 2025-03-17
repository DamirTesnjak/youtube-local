'use server';

import fs from 'fs';
import path from 'path';

const homeFolder = '/host';

export default async function getFolderContent(folderPath: string | undefined) {
    // @ts-ignore
    console.log(`Node.js is running as UID: ${process.getuid()} and GID: ${process.getgid()}`);
    const dirPath = folderPath && folderPath.length > 0 ? folderPath : homeFolder;

  try {
    const dirContent = fs.readdirSync(dirPath, {
      withFileTypes: false,
      recursive: false,
    });

    const content = dirContent.map((item) => {
      const filePath = path.join(dirPath, item as string);
      return {
        fileName: item,
        filePath,
        parentPath: dirPath,
        pathIsFile: fs.statSync(filePath).isFile(),
        pathIsDirectory: fs.statSync(filePath).isDirectory(),
        isBlockDevice: fs.statSync(filePath).isBlockDevice(),
        isCharacterDevice: fs.statSync(filePath).isCharacterDevice(),
      };
    });

    return {
      success: true,
      folderContent: content.filter((item) => item.pathIsDirectory),
      currentPath: dirPath,
    };
  } catch (error) {
    return {
      success: false,
      currentPath: homeFolder,
    };
  }
}

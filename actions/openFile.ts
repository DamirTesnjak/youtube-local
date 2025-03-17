'use server';

import { execSync } from 'node:child_process';
import os from 'os';

export default async function openFile(filePath: string) {
  const osPlatform = os.platform();
  try {
    let command = '';

    if (osPlatform === 'win32') {
      command = `start "" "${filePath}"`;
    } else if (osPlatform === 'darwin') {
      command = `start "${filePath}"`;
    } else if (osPlatform === 'linux') {
      command = `"${filePath}"`; // Linux
    }

    execSync(command, { timeout: 5000 });
  } catch (error) {
    return {
      success: false,
      errorMessage: 'Cannot open file! Something went wrong.',
    };
  }
}

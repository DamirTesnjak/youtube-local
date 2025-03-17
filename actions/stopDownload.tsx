'use server';

import os from 'os';
import { execSync } from 'node:child_process';
import { getSocket } from '@/util/socket';

// @ts-ignore
export default async function stopDownload({
  pid,
  clientId,
  downloadUuid,
  uuid,
}: {
  pid: number;
  uuid: string;
  downloadUuid: string;
  clientId: string;
}) {
  console.log('Stopping FFmpeg process...');

  try {
    if (os.platform() === 'win32') {
      // Windows: Use taskkill
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
    } else {
      // macOS/Linux
      process.kill(pid, 'SIGTERM'); // Gracefully stop
    }
    const socket = getSocket();
    socket?.emit('cancelDownload', { uuid, downloadUuid, clientId });
    console.log(`Process ${pid} killed successfully. Download stopped`);
  } catch (_error) {
    console.error(`Failed to kill process ${pid}`);
  }
}

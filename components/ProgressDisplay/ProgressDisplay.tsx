'use client';

import { useEffect, useState } from 'react';
import ProgressDisplayItem from '@/components/ProgressDisplay/ProgressDisplayItem/ProgressDisplayItem';
import { getSocket } from '@/util/socket';
import { IProgressData } from '@/actions/downloadYtVideo';

export type IProgressInfo = {
  [x: string]: string | number | boolean | undefined;
  videoName: string;
  audioMessage?: string;
  audioMB?: string;
  audioProgressBar?: number;
  videoMessage?: string;
  videoProgressBar?: number;
  runningTimeMessage?: string;
  videoMB?: string;
  completed?: boolean;
  path?: string;
  pid?: number;
  uuid?: string;
  downloadUuid?: string;
  canceledDownload?: boolean;
  clientId: string;
};

export type IProgressDisplay = {
  uuid: string;
  clientId: string;
};

export default function ProgressDisplay({ uuid, clientId }: IProgressDisplay) {
  const [progressData, setProgressData] = useState<IProgressData[]>([]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('progressData', (data) => {
      setProgressData(data);
    });

    addEventListener('beforeunload', () => {
      socket.emit('disconnectUser', { uuid, clientId });
      socket.disconnect();
    });

    return () => {
      socket.off('progressData');
      socket.off('disconnectUser');
      socket.disconnect();
    };
  }, []);

  return (
    progressData &&
    progressData.map((progress: IProgressData) => {
      const progressKey = Object.keys(progress)[0];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const progressInfo = progress[progressKey];
      return (
        <div key={progressInfo.videoName}>
          <ProgressDisplayItem
            progressInfo={progressInfo}
            clientId={clientId}
          />
        </div>
      );
    })
  );
}

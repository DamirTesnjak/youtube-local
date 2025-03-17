'use client';

import { startTransition, useState, FormEvent, useEffect } from 'react';
import { downloadYtVideo } from '@/actions/downloadYtVideo';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import ProgressDisplay from '@/components/ProgressDisplay/ProgressDisplay';
import { getSocket } from '@/util/socket';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';

export default function VideoDownloadForm({
  uuid,
  currentPath,
}: {
  uuid: string;
  currentPath: string;
}) {
  const router = useRouter();
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [responseDownloadComplete, setResponseDownloadComplete] = useState<
    | {
        fail: boolean;
        errorMessage: string;
      }
    | undefined
  >({
    fail: false,
    errorMessage: '',
  });
  const [clientId, setClientId] = useState('');

  const handlerOpenWindowContentModal = () => {
    Cookies.set('modalOpen', 'open');
    router.push(`/${uuid}`);
  };

  useEffect(() => {
    const socket = getSocket();
    socket.on('receiveSocketId', (data) => {
      setClientId(data.socketId);
    });
    return () => {
      socket.off('receiveSocketId');
    };
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ytUrlVideo = document.getElementById(
      'ytUrlVideo',
    ) as HTMLInputElement;
    const videoName = document.getElementById('videoName') as HTMLInputElement;

    const formData = new FormData();

    formData.append('ytUrlVideo', ytUrlVideo.value);
    formData.append('videoName', videoName.value);

    if (ytUrlVideo && videoName) {
      startTransition(async function () {
        if (currentPath) {
          const response = await downloadYtVideo({
            formData,
            currentPath,
            uuid,
            downloadUuid: uuidv4(),
            clientId,
          });
          setResponseDownloadComplete(response);
          setDownloadComplete(false);
        }
      });
    }
  }

  return (
    <div className='sm:col-start-1 sm:col-end-1 md:col-start-1 md:col-end-1 lg:col-start-2 lg:col-end-3 flex flex-col gap-2'>
      <form
        className='flex flex-row gap-3 items-end max-h-20'
        id='downloadForm'
        onSubmit={(e) => onSubmit(e)}
      >
        <div className='flex flex-col'>
          <label className='pt-2 pb-2 pl-3 pr-3 font-mono text-sm'>
            Youtube Url video
          </label>
          <input
            className='pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-100'
            id='ytUrlVideo'
          />
        </div>
        <div className='flex flex-col'>
          <label className='pt-2 pb-2 pl-3 pr-3 font-mono text-sm'>
            Video name
          </label>
          <input
            className='pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-100'
            id='videoName'
          />
        </div>
        <Button
          id='saveButton'
          text='Save video to...'
          type='button'
          onClick={() => handlerOpenWindowContentModal()}
        />
        <Button id='saveButton' text='Download' type='submit' />
        {downloadComplete && <div>Download complete</div>}
      </form>
      <div className='h-[80vh] overflow-y-scroll'>
        <ProgressDisplay uuid={uuid} clientId={clientId} />
      </div>
      {responseDownloadComplete?.fail && (
        <Modal
          title='Error'
          message={responseDownloadComplete.errorMessage as string}
          onClick={() =>
            setResponseDownloadComplete({
              fail: false,
              errorMessage: '',
            })
          }
        />
      )}
    </div>
  );
}

'use client';

import Button from '@/components/Button/Button';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type IModal = {
  title: string;
  message: string;
  onClick: () => void;
};

export default function Modal({ title, message, onClick }: IModal) {
  const elRef = useRef<HTMLElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    const modalRoot = document.getElementById('modal')!;
    modalRoot?.appendChild(elRef.current!);
    const removeChild = () => {
      modalRoot?.removeChild(elRef.current!);
    };
    return removeChild;
  }, []);

  return createPortal(
    <div
      className='flex justify-center items-center bg-gray-950/50 backdrop-blur-xs'
      style={{
        position: 'absolute',
        zIndex: 10,
        top: 0,
        height: '100vh',
        width: '100vw',
      }}
    >
      <div className='p-3 grid grid-flow-row w-[50vw] bg-white'>
        <div className='text-[25px] font-semibold'>{title}</div>
        <div>{message}</div>
        <div className='mt-3 flex flex-row gap-2 max-h-10 justify-center'>
          <Button type='button' text='OK' onClick={onClick} />
        </div>
      </div>
      ,
    </div>,
    elRef.current,
  );
}

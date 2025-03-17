'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function OkButton({ uuid }: { uuid: string }) {
  const router = useRouter();
  const handlerCancel = () => {
    Cookies.set('modalOpen', 'close');
    router.push(`/${uuid}`);
  };
  return (
    <button
      className='w-20 pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-950 text-white font-light font-stretch-semi-expanded cursor-pointer hover:bg-blue-600'
      onClick={() => handlerCancel()}
    >
      Ok
    </button>
  );
}

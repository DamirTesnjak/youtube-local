'use client';

export default function Button({
  id,
  onClick,
  text,
  type,
}: {
  id?: string;
  onClick?: () => void;
  text?: string;
  type: 'submit' | 'reset' | 'button' | undefined;
}) {
  return (
    <button
      id={id}
      className='w-auto pt-2 pb-2 pl-3 pr-3 rounded-sm bg-blue-950 text-white font-light font-stretch-semi-expanded cursor-pointer hover:bg-blue-600'
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

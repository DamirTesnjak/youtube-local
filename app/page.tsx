import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect(`/${uuidv4()}`);
}

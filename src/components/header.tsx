import type { User } from '@prisma/client';
import Link from 'next/link';

async function getUser(): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json();
}

export default async function Header(): Promise<JSX.Element> {
  const user = await getUser();

  return (
    <header className="p-4 text-black">
      <Link href="/" className="font-bold text-2xl">
        Rinoto
      </Link>
      {user ? <div>{user.name}</div> : null}
    </header>
  );
}

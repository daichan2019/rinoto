import { baseUrl } from '@/lib/baseUrl';
import type { User } from '@prisma/client';
import { headers } from 'next/headers';
import Link from 'next/link';

async function getUser(): Promise<User | null> {
  try {
    const headersList = headers();

    const res = await fetch(`${baseUrl}/api/auth/user`, {
      cache: 'no-store',
      headers: {
        Cookie: headersList.get('cookie') || '',
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      throw new Error(`Failed to fetch user: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function Header(): Promise<JSX.Element> {
  const user = await getUser();

  return (
    <header className="grid grid-cols-2 items-center p-4 text-black">
      <Link href="/" className="justify-self-start font-bold text-2xl">
        Rinoto
      </Link>
      {user ? <div className="justify-self-end">{user.name}</div> : null}
    </header>
  );
}

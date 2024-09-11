import type { User } from '@prisma/client';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getUser(): Promise<User | null> {
  try {
    const headersList = headers();
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
    const baseUrl = `${protocol}://${host}`;

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
    redirect('/login');
  }
}

export async function Header(): Promise<JSX.Element> {
  const user = await getUser();

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <h1 className="font-bold text-3xl">Rinoto</h1>
        </Link>
        {user ? <div>{user.name}</div> : null}
      </header>
    </div>
  );
}

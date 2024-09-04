import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import type { User } from '@prisma/client';
import { headers } from 'next/headers';
import Link from 'next/link';

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
    return null;
  }
}

export async function Header(): Promise<JSX.Element> {
  const user = await getUser();

  return (
    <header className="grid grid-cols-2 items-center p-4 text-black">
      <h1>
        <Link href="/" className="justify-self-start font-bold text-2xl">
          Rinoto
        </Link>
      </h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {user ? <div className="justify-self-end">{user.name}</div> : null}
    </header>
  );
}

import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import type { User } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
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
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <h1>Rinoto</h1>
        </Link>
        <div className="ml-auto flex gap-2">
          <Link
            href="#"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 font-medium text-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            Cars
          </Link>
          <Link
            href="#"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 font-medium text-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            Portfolio
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/images/user-circle.svg" alt={user.name} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem className="font-bold text-lg">{user.name}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="#" className="block w-full text-left" prefetch={false}>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Button
                    type="button"
                    onClick={signOut}
                    variant="outline"
                    className="justify-self-end px-2 py-1 text-xs"
                  >
                    ログアウト
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </header>
    </div>
  );
}

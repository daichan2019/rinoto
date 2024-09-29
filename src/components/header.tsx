import { getUser } from '@/actions/get-user';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import Link from 'next/link';
export async function Header(): Promise<JSX.Element> {
  const { data: user, error } = await getUser();

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <h1 className="font-bold text-3xl">Rinoto</h1>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/custom-audios/new" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>音源を作成する</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div>{user.name}</div>
      </header>
    </div>
  );
}

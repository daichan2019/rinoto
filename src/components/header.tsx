import { getUser } from '@/actions/get-user';
import Link from 'next/link';
export async function Header(): Promise<JSX.Element> {
  const { data: user, error } = await getUser();

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <h1 className="font-bold text-3xl">Rinoto</h1>
        </Link>
        {user ? <div>{user.email}</div> : null}
      </header>
    </div>
  );
}

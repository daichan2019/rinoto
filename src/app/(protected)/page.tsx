import { signOut } from '@/actions/auth';
import { getSession } from '@/actions/get-session';
import { Header } from '@/components/header';
export default async function Page(): Promise<JSX.Element> {
  await getSession();

  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-stone-50">
      <Header />
      <form action={signOut}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}

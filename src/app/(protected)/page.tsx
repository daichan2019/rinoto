import { Header } from '@/components/header';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
export default async function Page(): Promise<JSX.Element> {
  const supabase = createClient();
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    console.error('Error fetching user:', error);
    redirect('/login');
  }

  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-stone-50">
      <Header />
    </div>
  );
}

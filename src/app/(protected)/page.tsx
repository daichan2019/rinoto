import { signOut } from '@/actions/auth';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-stone-50">
      <header className="border-stone-200 border-b bg-white p-4 shadow-sm">
        <h1 className="font-semibold text-2xl text-stone-800">Rinoto</h1>
      </header>

      <main className="grid place-items-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 font-medium text-stone-800 text-xl">マイページ</h2>
          <p className="mb-4 text-stone-600">
            ようこそ、<span className="font-medium">{user.email}</span> さん
          </p>
          <p className="mb-8 text-sm text-stone-500">ここはあなたの専用ページです。ゆっくりお過ごしください。</p>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-md border border-stone-300 bg-white px-4 py-2 text-stone-700 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
            >
              ログアウト
            </button>
          </form>
        </div>
      </main>

      <footer className="border-stone-200 border-t bg-white p-4 text-center text-stone-500">
        <p>&copy; 2023 Rinoto. All rights reserved.</p>
      </footer>
    </div>
  );
}

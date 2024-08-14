import { signOut } from '@/actions/auth';
import Header from '@/components/header';
import { createClient } from '@/lib/supabase/server';
import type { PresetAudio } from '@prisma/client';
import { redirect } from 'next/navigation';

async function getPresetAudios(): Promise<PresetAudio[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/preset-audios`, { next: { revalidate: 1 } });
  if (!res.ok) {
    throw new Error('Failed to fetch preset audios');
  }
  return res.json();
}

export default async function Page(): Promise<JSX.Element> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const presetAudios = await getPresetAudios();

  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-stone-50">
      <Header />
      <main className="grid place-items-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 font-medium text-stone-800 text-xl">マイページ</h2>
          <p className="mb-8 text-sm text-stone-500">ここはあなたの専用ページです。ゆっくりお過ごしください。</p>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-md border border-stone-300 bg-white px-4 py-2 text-stone-700 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
            >
              ログアウト
            </button>
          </form>
          {presetAudios.map(({ id, name, path }) => (
            <div key={id} className="rounded bg-white p-4 shadow">
              <h2 className="font-semibold text-lg">{name}</h2>
              <audio
                controls
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`}
                className="mt-2 w-full"
              >
                <track kind="captions" src="captions.vtt" label="Japanese" />
              </audio>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

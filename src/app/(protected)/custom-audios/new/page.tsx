import { getPresetAudios } from '@/actions/get-preset-audios';

export default async function Page(): Promise<JSX.Element> {
  const { data: presetAudios, error } = await getPresetAudios();
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!presetAudios) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">プリセットオーディオ</h1>
      <div className="space-y-4">
        {presetAudios.map(({ name, path }) => (
          <div key={name} className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-2 font-semibold text-lg">{name}</h2>
            <audio
              controls
              className="w-full"
              src={`https://rlscwwybxltcnyotblyl.supabase.co/storage/v1/object/public/${path}`}
            >
              お使いのブラウザはオーディオ要素をサポートしていません。
              <track kind="captions" srcLang="ja" label="Japanese" />
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}

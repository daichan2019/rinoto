import { getPresetAudios } from '@/actions/get-preset-audios';
import { AudioCard } from '@/components/audio-card';

export default async function Page(): Promise<JSX.Element> {
  const { data: presetAudios } = await getPresetAudios();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">プリセットオーディオ</h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
        {presetAudios.map((audio) => (
          <AudioCard key={audio.name} {...audio} />
        ))}
      </div>
    </div>
  );
}

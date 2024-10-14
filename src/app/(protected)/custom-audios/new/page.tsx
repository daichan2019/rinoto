import { getPresetAudios } from '@/actions/get-preset-audios';
import { CreateCustomAudioForm } from '@/components/create-custom-audio-form';
export default async function Page(): Promise<JSX.Element> {
  const { data: presetAudios } = await getPresetAudios();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 font-bold text-2xl">カスタムオーディオの作成</h2>
      <CreateCustomAudioForm presetAudios={presetAudios} />
    </div>
  );
}

import { getPresetAudios } from '@/actions/get-preset-audios';

export default async function Page(): Promise<JSX.Element> {
  const presetAudios = await getPresetAudios();

  return <div>{JSON.stringify(presetAudios)}</div>;
}

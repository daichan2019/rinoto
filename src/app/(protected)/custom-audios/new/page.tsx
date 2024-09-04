import { baseUrl } from '@/lib/baseUrl';
import type { PresetAudio } from '@prisma/client';
import { headers } from 'next/headers';

async function getPresetAudios(): Promise<PresetAudio[]> {
  const headersList = headers();
  try {
    const res = await fetch(`${baseUrl}/api/preset-audios`, {
      next: { revalidate: 1 },
      headers: {
        Cookie: headersList.get('cookie') || '',
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return [];
      }
      throw new Error(`Failed to fetch preset audios: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching preset audios:', error);
    return [];
  }
}

export default async function Page(): Promise<JSX.Element> {
  const presetAudios = await getPresetAudios();

  return <div>{JSON.stringify(presetAudios)}</div>;
}

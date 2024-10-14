import { createClient } from '@/lib/supabase/server';
import type { PresetAudio } from '@prisma/client';

type PresetAudioType = Pick<PresetAudio, 'name'> & { url: string };

export async function getPresetAudios(): Promise<{ data: PresetAudioType[] }> {
  const supabase = createClient();
  const { data: files } = await supabase.storage.from('preset-audios').list();

  if (!files || files.length === 0) {
    return { data: [] };
  }

  const presetAudios = await Promise.all(
    files.map(async (file) => {
      const { data: urlData, error: urlError } = await supabase.storage
        .from('preset-audios')
        .createSignedUrl(file.name, 3600);

      if (urlError) {
        console.error(`Error creating signed URL for ${file.name}:`, urlError);
        return null;
      }

      return {
        name: file.name,
        url: urlData.signedUrl,
      };
    }),
  );

  const validPresetAudios = presetAudios.filter((audio): audio is NonNullable<typeof audio> => audio !== null);

  return { data: validPresetAudios };
}

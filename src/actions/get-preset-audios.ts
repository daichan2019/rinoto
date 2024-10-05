import prisma from '@/lib/prisma';
import type { PresetAudio } from '@prisma/client';

export async function getPresetAudios(): Promise<{
  data?: Pick<PresetAudio, 'name' | 'path'>[];
  error?: string | null;
}> {
  try {
    const presetAudios = await prisma.presetAudio.findMany({
      orderBy: { id: 'asc' },
      select: {
        name: true,
        path: true,
      },
    });

    if (!presetAudios || presetAudios.length === 0) {
      return {
        error: 'プリセットオーディオが見つかりませんでした',
      };
    }

    return {
      data: presetAudios,
    };
  } catch (_error) {
    return {
      error: 'プリセットオーディオの取得に失敗しました',
    };
  }
}

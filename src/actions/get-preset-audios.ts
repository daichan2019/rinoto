import prisma from '@/lib/prisma';
import type { PresetAudio } from '@prisma/client';

export async function getPresetAudios(): Promise<{
  data?: Pick<PresetAudio, 'name' | 'path'>[];
  error?: string;
}> {
  try {
    const presetAudios = await prisma.presetAudio.findMany({
      orderBy: { id: 'asc' },
      select: {
        name: true,
        path: true,
      },
    });

    return {
      data: presetAudios,
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'データの取得に失敗しました',
    };
  }
}

'use server';
import { getSession } from '@/actions/get-session';
import prisma from '@/lib/prisma';
import type { User } from '@prisma/client';

export async function getUser(): Promise<{ data?: Pick<User, 'id' | 'email' | 'name'>; error?: string }> {
  const { data: supabaseUser } = await getSession();

  try {
    const user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return {
        error: 'ユーザーが見つかりませんでした',
      };
    }

    return {
      data: user,
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'データの取得に失敗しました',
    };
  }
}

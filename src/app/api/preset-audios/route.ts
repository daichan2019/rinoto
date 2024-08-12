import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const presetAudios = await prisma.presetAudio.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(presetAudios);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

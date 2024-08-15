import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const presetAudios = await prisma.presetAudio.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(presetAudios);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

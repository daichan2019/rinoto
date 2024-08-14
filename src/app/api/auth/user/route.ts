import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (dbError) {
    console.error('Error fetching user:', dbError);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

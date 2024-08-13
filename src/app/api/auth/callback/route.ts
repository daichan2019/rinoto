import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(`${origin}/400`, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Error exchanging code for session:', error);
    return NextResponse.redirect(`${origin}/401`, { status: 401 });
  }

  if (!supabaseUser) {
    return NextResponse.redirect(`${origin}/404`, { status: 404 });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email: supabaseUser.email },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: supabaseUser.user_metadata.full_name || user.name,
          updatedAt: new Date(),
        },
      });
      console.log('User information updated:', user.id);
    } else {
      user = await prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata.full_name || supabaseUser.email || '',
        },
      });
    }
  } catch (dbError) {
    console.error('Error creating/updating user record:', dbError);
    return NextResponse.redirect(`${origin}/500`, { status: 500 });
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`, { status: 302 });
  }

  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`, { status: 302 });
  }

  return NextResponse.redirect(`${origin}${next}`, { status: 302 });
}

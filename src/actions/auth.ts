'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signInWithGoogle() {
  const supabase = createClient();

  const {
    data: { url },
    error,
  } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error during Google sign-in:', error.message);
    redirect('/error?message=Authentication failed');
  }

  if (!url) {
    console.error('No URL returned from signInWithOAuth');
    redirect('/error?message=Authentication failed');
  }

  redirect(url);
}

export async function signOut() {
  const supabase = createClient();

  await supabase.auth.signOut();

  return redirect('/login');
}

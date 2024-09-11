'use server';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
export async function getSession(): Promise<{ data: User }> {
  const supabase = createClient();
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    console.error(error);
    redirect('/login');
  }

  return {
    data: supabaseUser,
  };
}

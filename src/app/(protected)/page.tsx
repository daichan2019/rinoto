import { signOut } from '@/actions/auth';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="w-full">
      <div>{user.email}</div>
      <form action={signOut}>
        <button type="submit">ログアウト</button>
      </form>
    </div>
  );
}

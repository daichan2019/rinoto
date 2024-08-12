import { signInWithGoogle } from '@/actions/auth';
import Image from 'next/image';

export default function Page(): JSX.Element {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Image src="/images/google-logo.svg" alt="Google" width={18} height={18} className="mr-2" />
            Google でログインする
          </button>
        </form>
      </div>
    </div>
  );
}

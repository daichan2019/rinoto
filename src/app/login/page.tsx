import { signInWithGoogle } from '@/actions/auth';
import Image from 'next/image';

export default function Page(): JSX.Element {
  return (
    <div>
      <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
          <div className="md:w-8/12 lg:w-5/12 bg-white px-8 py-10">
            <div className="mb-6">
              <form action={signInWithGoogle}>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Image
                    src="/images/google-logo.svg"
                    alt="Google logo"
                    width={18}
                    height={18}
                    className="mr-2"
                  />
                  Google でログインする
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

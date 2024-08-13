import Link from 'next/link';

export default async function Header(): Promise<JSX.Element> {
  return (
    <header className="p-4">
      <Link href="/" className="font-bold text-2xl text-black">
        Rinoto
      </Link>
    </header>
  );
}

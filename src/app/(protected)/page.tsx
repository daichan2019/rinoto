import { Header } from '@/components/header';

export default async function Page(): Promise<JSX.Element> {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-stone-50">
      <Header />
    </div>
  );
}

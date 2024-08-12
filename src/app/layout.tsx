import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rinoto',
  description: 'Rinoto は耳鳴りに悩む方の不安を解消するためのアプリケーションです。',
};

export type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="bg-gray-100 text-black">{children}</div>
      </body>
    </html>
  );
}

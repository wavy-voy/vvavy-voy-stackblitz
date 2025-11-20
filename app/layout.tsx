import '../styles/globals.scss';
import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import { Footer } from '../components/Footer/Footer';
import Header from '@/components/Header/Header';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm',
});

export const metadata: Metadata = {
  title: 'VVAVY Studio',
  description: 'VVAVY is a studio for art & tech.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body>
        <ScrollToTop />
        <Header />
        {children}
      </body>
    </html>
  );
}

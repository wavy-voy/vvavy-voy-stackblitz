import '../styles/globals.scss';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { IBM_Plex_Mono } from 'next/font/google';
import { Footer } from '../components/Footer/Footer';
import Header from '@/components/Header/Header';
import Head from 'next/head';
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
    icon: '/favicon.ico',
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
        <Footer />
      </body>
    </html>
  );
}

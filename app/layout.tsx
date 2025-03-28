import localFont from 'next/font/local';
import './globals.css';
import { getSEOTags } from './lib/seo';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = getSEOTags({
  title: 'Wasomi',
  description:
    'Wasomi is the modern all-in-one school management information system for administrators, parents, teachers and students.',
  canonicalUrlRelative: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

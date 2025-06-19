import localFont from "next/font/local";
import "./globals.css";
import { getSEOTags } from "./lib/seo";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = getSEOTags({
  title: "Kazini HR",
  description: "All-in-one HR solution for you and your team",
  canonicalUrlRelative: "/",
  robots: { index: false, follow: false },
  viewport: { initialScale: 1, width: "device-width" },
  openGraph: {
    type: "website",
    title: "Kazini HR",
    url: "https://www.kazinihr.co.ke/",
    description: "All-in-one HR solution for you & your team",
    images: [
      "https://lh5.googleusercontent.com/p/AF1QipPj5KMwbKxeb2tsY8g77WRx15C7vtLfrnCXGzTa=w652-h160-k-no",
    ],
    ttl: 604800,
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

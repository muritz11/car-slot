import type { Metadata } from "next";
import localFont from "next/font/local";
import ClientSessionProvider from "../../utils/ClientSessionProvider";
import "./assets/styles/globals.css";
import { Providers } from "./Providers";

const geistSans = localFont({
  src: "./assets/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./assets/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Car slot",
  description: "Find the perfect space for your vehicle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientSessionProvider>
          <Providers>{children}</Providers>
        </ClientSessionProvider>
      </body>
    </html>
  );
}

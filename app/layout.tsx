import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/app/components/theme-provider"
import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({
  weight: '400',
  style: "normal",
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "MetaMind | blogs | posts | articles",
  description: "MetaMind` is a platform for sharing your thoughts, ideas, and knowledge with the world. Write blogs, articles, and posts on any topic you like.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >

          {children}
          <Toaster />

        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {`r`n  title: "Orine Credit",`r`n  description: "Building financial strength together with personalized banking solutions for every member.",`r`n  icons: {`r`n    icon: "/images/Logo.png",`r`n    shortcut: "/images/Logo.png",`r`n    apple: "/images/Logo.png",`r`n  },`r`n};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider />
        {children}
      </body>
    </html>
  );
}

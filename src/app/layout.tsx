'use client'

import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import "./layout.css";
import { usePathname, useRouter } from "next/navigation";
import { CookiesProvider } from "react-cookie";
import { isMobile } from "react-device-detect";
import { useMemo } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Mono&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,200..800;1,200..800&family=PT+Mono&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Mono&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="layout-body">
        <CookiesProvider>
          <Navbar router={router}/>
          <div className="layout-content">
            {children}
          </div>
          <Footer />
        </CookiesProvider>
      </body>
    </html>
  );
}

"use client";

// import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";

import 'react-toastify/dist/ReactToastify.css';
import { useThemeStore } from "@/store/ThemeStore";

export const nunito = Nunito({
  weight: ['400', '500', '600'], // Define the weights you need
  subsets: ["latin"], // Define character subsets
  style: ['normal', 'italic'], // You can specify styles (optional)
})

// export const metadata: Metadata = {
//   title: "Wasek Samin Portfolio",
//   description: "Wasek Samin, A full-stack developer",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const getUserDetails = useUserStore((state: any) => state.getUserDetails);

  // useEffect(() => {
  //   getUserDetails();
  // }, [])

  const toggleDarkMode = useThemeStore((state: any) => state.toggleDarkMode);

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    // Default to light theme
    if (theme) {
      if (theme === "dark") {
        toggleDarkMode(true);
      } else {
        toggleDarkMode(false);
      }
    } else {
      toggleDarkMode(false);
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <title>E-Book</title>
        <meta name='description' content='E-Book is a book library platform where you can download and read books' />
      </head>

      <body
        className={`tracking-wider leading-6 ${nunito.className}`}
      >
        {children}
      </body>
    </html>
  );
}

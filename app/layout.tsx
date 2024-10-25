"use client";

// import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";

import 'react-toastify/dist/ReactToastify.css';
import { useThemeStore } from "@/store/ThemeStore";
import { ToastContainer } from "react-toastify";
import { useUserStore } from "@/store/UserStore";
import { pb } from "@/store/PocketbaseStore";
import { usePageStore } from "@/store/PageStore";
import { usePathname, useRouter } from "next/navigation";
import { ImSpinner } from "react-icons/im";

export const nunito = Nunito({
  weight: ['400', '500', '600'], // Define the weights you need
  subsets: ["latin"], // Define character subsets
  style: ['normal', 'italic'], // You can specify styles (optional)
})

// export const metadata: Metadata = {
//   title: "Wasek Samin Portfolio",
//   description: "Wasek Samin, A full-stack developer",
// };

// Pathnames that do not need checking
const PATHNAMES_NO_CHECK = [
  "/login",
  "/help"
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const toggleDarkMode = useThemeStore((state: any) => state.toggleDarkMode);
  const updateIsPageLoading = usePageStore((state: any) => state.updateIsPageLoading);

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

  useEffect(() => {
    if (!PATHNAMES_NO_CHECK.includes(pathname)) {
      if (pb?.authStore?.model) {
        updateIsPageLoading(false);
      } else {
        router.push("/login");
      }
    }

    return () => {
      updateIsPageLoading(true);
    }
  }, [pathname])

  return (
    <html lang="en">
      <head>
        <title>E-Book</title>
        <meta name='description' content='E-Book is a book library platform where you can download and read books' />
      </head>

      <body
        className={`tracking-wider leading-6 ${nunito.className}`}
      >
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}

"use client";

import Footer from "@/components/footer/Footer";
import Navbar from "@/components/header/Navbar";
import Banner from "@/components/home/Banner";
import PopularGenre from "@/components/home/PopularGenre";
import { usePageStore } from "@/store/PageStore";
import { ImSpinner } from "react-icons/im";

export default function Home() {
  const isPageLoading = usePageStore((state: any) => state.isPageLoading);

  return (
    isPageLoading ?
      <div className="w-full h-svh flex items-center justify-center">
        <ImSpinner className="page__spinner" />
      </div> :
      <>
        <Navbar />

        <div className="base-layout container mx-auto">
          <Banner />
          <PopularGenre />
        </div>

        <Footer />
      </>
  );
}

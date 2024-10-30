"use client";

import Footer from "@/components/footer/Footer";
import Navbar from "@/components/header/Navbar";
import Banner from "@/components/home/Banner";
import PopularGenre from "@/components/home/PopularGenre";
import { useBookStore } from "@/store/BookStore";
import { useGenreStore } from "@/store/GenreStore";
import { usePageStore } from "@/store/PageStore";
import { useEffect } from "react";
import { ImSpinner } from "react-icons/im";

export default function Home() {
  // Page store
  const isPageLoading = usePageStore((state: any) => state.isPageLoading);

  // Book store
  const emptyPopGenreBooks = useBookStore((state: any) => state.emptyPopGenreBooks);
  
  // Genre store
  const updateActiveGenre = useGenreStore((state: any) => state.updateActiveGenre);

  useEffect(() => {
    return () => {
      emptyPopGenreBooks();
      updateActiveGenre("");
    }
  }, [])

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

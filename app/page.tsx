"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/header/Navbar";
import Banner from "@/components/home/Banner";
import PopularGenre from "@/components/home/PopularGenre";

export default function Home() {
  return (
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

"use client";

import { useEffect, useRef, useState } from "react"
import DesktopNavbar from "./DesktopNavbar";
import { useThemeStore } from "@/store/ThemeStore";
import MobileNavbar from "./MobileNavbar";
import { useNavStore } from "@/store/NavStore";
import { AnimatePresence } from "framer-motion";
import SearchBookModal from "./SearchBookModal";

const Navbar = () => {
  const [showMobileNavbar, setShowMobileNavbar] = useState(true);
  const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
  const showBookSearchModal = useNavStore((state: any) => state.showBookSearchModal)

  const navRef = useRef<HTMLElement | null>(null);

  const windowScrollEvent = () => {
    if (navRef.current) {
      if (window.scrollY > 50) {
        navRef.current.classList.add("shadow-md");
      } else {
        navRef.current.classList.remove("shadow-md");
      }
    }
  }

  const windowOnResize = () => {
    if (window.innerWidth < 768) {
      setShowMobileNavbar(true);
    } else {
      setShowMobileNavbar(false);
    } 
  }

  useEffect(() => {
    windowOnResize();
    window.addEventListener("resize", windowOnResize);
    windowScrollEvent();
    window.addEventListener("scroll", windowScrollEvent);
  }, [])

  return (
    <nav ref={navRef} className={`fixed w-full top-0 ${isDarkMode ? "bg-dark" : "bg-white"} z-[1002]`}>
      <div className="nav-layout container mx-auto py-3">
        {
          showMobileNavbar ?
            <MobileNavbar /> :
            <DesktopNavbar />
        }
      </div>

      <AnimatePresence initial={false} mode="wait">
        {
          showBookSearchModal && 
          <SearchBookModal />
        }
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
"use client";

import { useEffect, useRef, useState } from "react"
import DesktopNavbar from "./DesktopNavbar";
import { useThemeStore } from "@/store/ThemeStore";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  const [showMobileNavbar, setShowMobileNavbar] = useState(true);
  const isDarkMode = useThemeStore((state: any) => state.isDarkMode);

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
    </nav>
  )
}

export default Navbar
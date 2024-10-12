import Link from "next/link"
import { IoSearch } from "react-icons/io5"
import NavProfile from "./NavProfile"
import { useRef } from "react"
import { useNavStore } from "@/store/NavStore"
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useThemeStore } from "@/store/ThemeStore"

const DesktopNavbar = () => {
  const navSearchRef = useRef<HTMLDivElement | null>(null);
  const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state: any) => state.toggleDarkMode);
  const showBookSearchModal = useNavStore((state: any) => state.showBookSearchModal);
  const updateShowBookSearchModal = useNavStore((state: any) => state.updateShowBookSearchModal);

  const searchNavOnFocus = (e: any) => {
    navSearchRef.current?.classList.add("ring-2");
    if (isDarkMode) {
      navSearchRef.current?.classList.add("ring-stone-700");
    } else {
      navSearchRef.current?.classList.add("ring-indigo-200");
    }
  }

  const searchNavOnBlur = (e: any) => {
    navSearchRef.current?.classList.remove("ring-2");
    if (isDarkMode) {
      navSearchRef.current?.classList.remove("ring-stone-700");
    } else {
      navSearchRef.current?.classList.remove("ring-indigo-200");
    }
  }

  const toggleBookModalSearch = (showModal: boolean) => {
    updateShowBookSearchModal(showModal);
  }

  return (
    <div className="flex items-center justify-between gap-x-5">
      <Link href="/" className="whitespace-nowrap text-3xl font-semibold italic">E-Book</Link>
      <div onClick={() => toggleBookModalSearch(true)} ref={navSearchRef} className="w-1/2 flex items-center gap-x-3 rounded-md py-1.5 px-3 theme-block transition-all duration-200 ease-linear">
        <input onFocus={searchNavOnFocus} onBlur={searchNavOnBlur} type="text" className="w-full bg-transparent focus:outline-none" placeholder="Search books..." />
        <IoSearch className="text-xl text-stone-500/80 cursor-pointer" />
      </div>

      <div className="flex items-center gap-x-5">
        <NavProfile />
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={20}
        />
      </div>
    </div>
  )
}

export default DesktopNavbar
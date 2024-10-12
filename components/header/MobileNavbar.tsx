import { useNavStore } from "@/store/NavStore";
import Link from "next/link"
import { IoSearch } from "react-icons/io5"
import NavProfile from "./NavProfile";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useThemeStore } from "@/store/ThemeStore";
import { useRef } from "react";
import { RiMenu2Line } from "react-icons/ri";
import MobileNavSidebar from "./MobileNavSidebar";
import { AnimatePresence } from "framer-motion";

const MobileNavbar = () => {
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
    const toggleDarkMode = useThemeStore((state: any) => state.toggleDarkMode);
    const updateShowBookSearchModal = useNavStore((state: any) => state.updateShowBookSearchModal);

    const showMobileNavSidebar = useNavStore((state: any) => state.showMobileNavSidebar);
    const updateShowMobileNavSidebar = useNavStore((state: any) => state.updateShowMobileNavSidebar);

    const navSidebarToggleBtnRef = useRef<HTMLButtonElement | null>(null);

    const toggleBookModalSearch = (showModal: boolean) => {
        updateShowBookSearchModal(showModal);
    }

    const handleNavSidebarToggle = () => {
        updateShowMobileNavSidebar(!showMobileNavSidebar);
    }

    return (
        <>
            <div className="flex items-center justify-between gap-x-5">
                <div className="flex items-center gap-x-5">
                    <button type="button" ref={navSidebarToggleBtnRef} onClick={handleNavSidebarToggle}>
                        <RiMenu2Line className="w-6 h-6 min-w-6 min-h-6" />
                    </button>
                    <Link href="/" className="whitespace-nowrap text-xl font-semibold italic">E-Book</Link>
                </div>
                <div className="flex items-center gap-x-5">
                    <button type="button" onClick={() => toggleBookModalSearch(true)} className="p-2 theme-block rounded-full">
                        <IoSearch className={`text-xl ${isDarkMode ? "" : "text-stone-500/80"}`} />
                    </button>
                    <NavProfile />
                    <DarkModeSwitch
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        size={20}
                    />
                </div>
            </div>

            <AnimatePresence initial={false} mode="wait">
                {
                    showMobileNavSidebar &&
                    <MobileNavSidebar navSidebarToggleBtnRef={navSidebarToggleBtnRef} handleNavSidebarToggle={handleNavSidebarToggle} />
                }
            </AnimatePresence>
        </>
    )
}

export default MobileNavbar
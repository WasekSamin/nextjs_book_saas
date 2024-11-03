import { NAV_LINKS, useNavStore } from "@/store/NavStore";
import { useThemeStore } from "@/store/ThemeStore"
import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const MobileNavSidebar = ({ navSidebarToggleBtnRef, handleNavSidebarToggle }: any) => {
    const pathname = usePathname();
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);

    const mobileNavSidebarRef = useRef<HTMLDivElement | null>(null);

    const navSidebarClickListener = (e: any) => {
        if (navSidebarToggleBtnRef.current?.contains(e.target) ||
            mobileNavSidebarRef.current?.contains(e.target)
        ) return;

        handleNavSidebarToggle();
    }

    useEffect(() => {
        document.addEventListener("click", navSidebarClickListener);

        return () => {
            document.removeEventListener("click", navSidebarClickListener);
        }
    }, [])

    return (
        <>
            <div className="overlay"></div>
            <motion.div
                ref={mobileNavSidebarRef}
                initial={{
                    left: "-100%",
                    opacity: 0
                }}
                animate={{
                    left: 0,
                    opacity: 1
                }}
                exit={{
                    left: "-100%",
                    opacity: 0
                }}
                className={`fixed top-0 w-[60%] min-[450px]:w-1/2 h-svh z-[1003] py-5 ${isDarkMode ? "bg-dark" : "bg-light"}`}>
                <ul className="flex flex-col gap-y-5 w-full h-full overflow-x-hidden">
                    <li className="pb-5 px-5 border-b border-theme">
                        <Link href="/" className="whitespace-nowrap text-xl font-semibold italic">E-Book</Link>
                    </li>

                    <div className="flex flex-col gap-y-5 w-full h-full overflow-y-auto">
                        {
                            NAV_LINKS?.map((nav, index: number) => (
                                <li key={index} className="px-5">
                                    <Link href={nav.url} className={`flex items-center gap-x-3 w-full ${nav.url === pathname ? "text-primary" : "hover:text-primary"}  transition-colors duration-200 ease-linear`}>
                                        {nav.icon} <span>{nav.title}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </div>

                    <li className="px-5">
                        <button type="button" className="px-3 py-2 bg-rose-500 text-white rounded-md flex items-center justify-center gap-x-3 w-full text-hover:primary transition-colors duration-200 ease-linear">
                            <IoIosLogOut /> <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </motion.div>
        </>
    )
}

export default MobileNavSidebar
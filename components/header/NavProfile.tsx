import { NAV_LINKS, useNavStore } from '@/store/NavStore';
import Link from 'next/link';
import Avatar from 'react-avatar';
import { IoIosLogOut } from 'react-icons/io';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/ThemeStore';

const NavProfile = () => {
    const showProfileModal = useNavStore((state: any) => state.showProfileModal);
    const updateShowProfileModal = useNavStore((state: any) => state.updateShowProfileModal);

    const toggleProfileModal = (showModal: boolean) => {
        updateShowProfileModal(showModal);
    }

    const profileModalListener = (e: any) => {
        if (e.target.closest("#profile__modalRef")) return;

        toggleProfileModal(false);
    }

    useEffect(() => {
        window.addEventListener("click", profileModalListener)
    }, [])

    return (
        <div className="relative" id="profile__modalRef">
            <Avatar name="Wasek Samin" round={true} size="35px" className='cursor-pointer' onClick={() => toggleProfileModal(!showProfileModal)} />

            <AnimatePresence mode='wait' initial={false}>
                {
                    showProfileModal &&
                    <motion.ul
                        initial={{
                            top: 0,
                            opacity: 0
                        }}
                        animate={{
                            top: "135%",
                            opacity: 1
                        }}
                        exit={{
                            top: 0,
                            opacity: 0
                        }}
                        className="absolute right-0 flex flex-col gap-y-3 min-w-[15rem] theme-block rounded-md p-3 shadow-md">
                        {
                            NAV_LINKS?.map((nav, index: number) => (
                                <li key={index}>
                                    <Link href={nav.url} className="flex items-center gap-x-3 w-full hover:text-primary transition-colors duration-200 ease-linear">
                                        {nav.icon} <span>{nav.title}</span>
                                    </Link>
                                </li>
                            ))
                        }
                        <li>
                            <button type='button' className="flex items-center gap-x-3 w-full hover:text-danger transition-colors duration-200 ease-linear">
                                <IoIosLogOut /> <span>Logout</span>
                            </button>
                        </li>
                    </motion.ul>
                }
            </AnimatePresence>
        </div>
    )
}

export default NavProfile
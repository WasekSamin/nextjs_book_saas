import { FaRegHeart, FaRegUser } from 'react-icons/fa';
import { IoBookOutline } from 'react-icons/io5';
import { create } from 'zustand'

export const NAV_LINKS = [
    {
        title: "Favourite Books",
        icon: <FaRegHeart />,
        url: "/favourite-books"
    },
    {
        title: "Purchased Books",
        icon: <IoBookOutline />,
        url: "/purchased-books"
    },
    {
        title: "Profile",
        icon: <FaRegUser />,
        url: "/profile"
    }
]

export const useNavStore = create((set) => ({
    showProfileModal: false,
    updateShowProfileModal: (showModal: boolean) => {
        set(() => ({
            showProfileModal: showModal
        }))
    },
    showMobileNavSidebar: false,
    updateShowMobileNavSidebar: (show: boolean) => {
        set(() => ({
            showMobileNavSidebar: show
        }))
    },
    showBookSearchModal: false,
    updateShowBookSearchModal: (showModal: boolean) => {
        set(() => ({
            showBookSearchModal: showModal
        }))
    },
}));
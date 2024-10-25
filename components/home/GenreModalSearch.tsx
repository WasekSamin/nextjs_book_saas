import { useThemeStore } from '@/store/ThemeStore';
import React, { useRef } from 'react'
import { IoSearch } from 'react-icons/io5';

const GenreModalSearch = () => {
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
    const genreSearchRef = useRef<HTMLFormElement | null>(null);
    const genreInputRef = useRef<HTMLInputElement | null>(null);

    const genreOnFocus = () => {
        if (genreSearchRef.current) {
            genreSearchRef.current.classList.add("ring-2");
            if (isDarkMode) {
                genreSearchRef.current.classList.add("ring-stone-700");
            } else {
                genreSearchRef.current.classList.add("ring-indigo-200");
            }
        }
    }

    const genreOnBlur = () => {
        if (genreSearchRef.current) {
            genreSearchRef.current.classList.remove("ring-2");
            if (isDarkMode) {
                genreSearchRef.current.classList.remove("ring-stone-700");
            } else {
                genreSearchRef.current.classList.remove("ring-indigo-200");
            }
        }
    }

    return (
        <form ref={genreSearchRef} className="w-full flex items-center gap-x-3 rounded-md py-1.5 px-3 border border-theme transition-all duration-200 ease-linear">
            <input onFocus={genreOnFocus} onBlur={genreOnBlur} ref={genreInputRef} type="text" className="w-full bg-transparent focus:outline-none" placeholder="Search genres..." />
            <IoSearch className="text-xl text-stone-500/80 cursor-pointer" />
        </form>
    )
}

export default GenreModalSearch
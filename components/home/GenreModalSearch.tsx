import { fetchAllGenres, useGenreStore } from '@/store/GenreStore';
import { useThemeStore } from '@/store/ThemeStore';
import { RecordModel } from 'pocketbase';
import React, { useRef } from 'react'
import { IoSearch } from 'react-icons/io5';
import { useDebouncedCallback } from 'use-debounce';

const GenreModalSearch = () => {
    // Theme store
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);

    // Genre store
    const addGenres = useGenreStore((state: any) => state.addGenres);
    const emptyGenres = useGenreStore((state: any) => state.emptyGenres);
    const searchGenreText = useGenreStore((state: any) => state.searchGenreText);
    const updateSearchGenreText = useGenreStore((state: any) => state.updateSearchGenreText);
    const updateIsFetchingGenre = useGenreStore((state: any) => state.updateIsFetchingGenre);

    const genreSearchRef = useRef<HTMLFormElement | null>(null);
    const genreInputRef = useRef<HTMLInputElement | null>(null);

    const searchGenres = async() => {
        updateIsFetchingGenre(true);
        emptyGenres();

        const searchText = genreInputRef.current?.value?.trim() ?? "";
        updateSearchGenreText(searchText);

        const genres: RecordModel[] = await fetchAllGenres({searchText: searchText});

        genres?.map((genre: RecordModel) => {
            addGenres(genre);
        });

        updateIsFetchingGenre(false);
    }

    // Debounce callback
    const searchGenreDebounce = useDebouncedCallback(
        // function
        async (value) => {
            await searchGenres();
        },
        // delay in ms
        1000
    );

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

    const handleGenreSearchText = (e: any) => {
        searchGenreDebounce(e.target.value);
    }

    const handleGenreSearchForm = async(e: any) => {
        e.preventDefault();

        await searchGenres();
    }

    return (
        <form onSubmit={handleGenreSearchForm} ref={genreSearchRef} className="w-full flex items-center gap-x-3 rounded-md py-1.5 px-3 border border-theme transition-all duration-200 ease-linear">
            <input defaultValue={searchGenreText} onChange={handleGenreSearchText} onFocus={genreOnFocus} onBlur={genreOnBlur} ref={genreInputRef} type="text" className="w-full bg-transparent focus:outline-none" placeholder="Search genres..." />
            <IoSearch className="text-xl text-stone-500/80 cursor-pointer" />
        </form>
    )
}

export default GenreModalSearch
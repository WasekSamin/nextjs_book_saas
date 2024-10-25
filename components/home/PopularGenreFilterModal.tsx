import { GENRE_TYPE, useGenreStore } from "@/store/GenreStore";
import { pb } from "@/store/PocketbaseStore";
import { useThemeStore } from "@/store/ThemeStore";
import { makeToast } from "@/utils/toastMesage";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import GenreModalSearch from "./GenreModalSearch";


const PopularGenreFilterModal = () => {
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
    const activeTab = useGenreStore((state: any) => state.activeTab);
    const updateActiveTab = useGenreStore((state: any) => state.updateActiveTab);
    const showGenreModal = useGenreStore((state: any) => state.showGenreModal);
    const updateShowGenreModal = useGenreStore((state: any) => state.updateShowGenreModal);

    const genres = useGenreStore((state: any) => state.genres);
    const addGenres = useGenreStore((state: any) => state.addGenres);
    const reRenderGenre = useGenreStore((state: any) => state.reRenderGenre);
    const updateReRenderGenre = useGenreStore((state: any) => state.updateReRenderGenre);
    const emptyGenres = useGenreStore((state: any) => state.emptyGenres);

    
    const genreModalContentRef = useRef<HTMLDivElement | null>(null);

    const handleSelectPopularGenre = (tab: string) => {
        updateActiveTab(tab);
        updateShowGenreModal(false);
    }

    const genreFilterModalClickListener = (e: any) => {
        if (genreModalContentRef.current?.contains(e.target)) return;

        updateShowGenreModal(false);
    }

    useEffect(() => {
        if (showGenreModal) {
            document.addEventListener("click", genreFilterModalClickListener);
            document.body.classList.add("overflow-y-hidden");
        }

        return () => {
            document.removeEventListener("click", genreFilterModalClickListener);
            document.body.classList.remove("overflow-y-hidden");
        }
    }, [showGenreModal])

    const fetchAllGenres = async () => {
        try {
            const genreRecords = await pb.collection('genres').getFullList();

            genreRecords?.map(genre => {
                addGenres(genre);
            });

            updateReRenderGenre(false);
        } catch (err) {
            makeToast({
                toastType: "error",
                msg: "Failed to fetch genres!",
                isDark: isDarkMode
            });
            updateReRenderGenre(true);
            emptyGenres();
        }
    }

    useEffect(() => {
        if (reRenderGenre) {
            fetchAllGenres();
        }
    }, [])

    

    return (
        <div className="fixed w-full h-svh top-0 left-0 z-[1003]">
            <div className="overlay"></div>

            <div className="absolute inset-0 absolute-layout container mx-auto w-full h-full flex flex-col items-center justify-center z-[1003]">
                <motion.div
                    initial={{
                        scale: 0,
                        opacity: 0
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1
                    }}
                    exit={{
                        scale: 0,
                        opacity: 0
                    }}
                    ref={genreModalContentRef}
                    className="w-full h-auto max-h-[80vh] theme-block p-5 rounded-md shadow-md"
                >
                    <div className="flex flex-col w-full h-full">
                        <div className="flex items-center justify-between gap-x-5 pb-3 border-b border-theme">
                            <h5 className="text-lg font-semibold">Select Genre</h5>

                            <div className="flex">
                                <button onClick={() => updateShowGenreModal(false)} type="button" className="p-0.5 rounded-full rounded-close-btn text-danger">
                                    <IoClose className="text-lg" />
                                </button>
                            </div>
                        </div>

                        <div className="my-3">
                            <GenreModalSearch />
                        </div>

                        <div className="pt-3 flex flex-col gap-y-3 w-full h-full overflow-x-hidden overflow-y-auto">
                            <div onClick={() => handleSelectPopularGenre("")} className="flex items-center justify-between gap-x-5 cursor-pointer border-b border-theme pb-3 last:pb-0 last:border-b-0">
                                <p className="font-medium">All</p>
                                {
                                    activeTab === "" &&
                                    <p className="py-1 px-2 rounded-full bg-indigo-500 text-light text-xs">Selected</p>
                                }
                            </div>
                            {
                                genres?.map((genre: GENRE_TYPE) => (
                                    <div key={genre.id} onClick={() => handleSelectPopularGenre(genre.id)} className="flex items-center justify-between gap-x-5 cursor-pointer border-b border-theme pb-3 last:pb-0 last:border-b-0">
                                        <p className="font-medium">{genre.title}</p>
                                        {
                                            activeTab === genre.id &&
                                            <p className="py-1 px-2 rounded-full bg-indigo-500 text-light text-xs">Selected</p>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default PopularGenreFilterModal
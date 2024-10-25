import { useEffect, useRef, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

import PopularGenreSliderButton from "./PopularGenreSliderButton";
import { GENRE_TYPE, useGenreStore } from "@/store/GenreStore";
import { makeToast } from "@/utils/toastMesage";
import { useThemeStore } from "@/store/ThemeStore";
import { pb } from "@/store/PocketbaseStore";
import { ImSpinner } from "react-icons/im";

const PopularGenreSlider = () => {
    const popularGenreSwiperRef = useRef<any>(null);
    const [showSliderButton, setShowSliderButton] = useState({
        prevBtn: false,
        nextBtn: true
    });

    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
    const activeTab = useGenreStore((state: any) => state.activeTab);
    const updateActiveTab = useGenreStore((state: any) => state.updateActiveTab);

    const reRenderGenre = useGenreStore((state: any) => state.reRenderGenre);
    const updateReRenderGenre = useGenreStore((state: any) => state.updateReRenderGenre);
    const genres = useGenreStore((state: any) => state.genres);
    const addGenres = useGenreStore((state: any) => state.addGenres);
    const emptyGenres = useGenreStore((state: any) => state.emptyGenres);

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

    const handleSlidePrevSlide = () => {
        if (popularGenreSwiperRef.current) {
            if (!popularGenreSwiperRef.current.isEnd) {
                setShowSliderButton({
                    prevBtn: true,
                    nextBtn: true
                });
            }
            if (popularGenreSwiperRef.current.isBeginning) {
                setShowSliderButton({
                    prevBtn: false,
                    nextBtn: true
                });
            }
        }
    }

    const handleSlideNextSlide = () => {
        if (popularGenreSwiperRef.current) {
            if (!popularGenreSwiperRef.current.isBeginning) {
                setShowSliderButton({
                    prevBtn: true,
                    nextBtn: true
                });
            }
            if (popularGenreSwiperRef.current.isEnd) {
                setShowSliderButton({
                    prevBtn: true,
                    nextBtn: false
                });
            }
        }
    }

    const handleSlideChange = () => {
        if (popularGenreSwiperRef.current) {
            if (popularGenreSwiperRef.current.touchesDirection === "prev") {
                handleSlidePrevSlide();
            } else {
                handleSlideNextSlide();
            }
        }
    }

    const handleSelectPopularGenre = (tab: string) => {
        updateActiveTab(tab);
    }

    return (
        reRenderGenre ?
            <div className="mx-auto">
                <ImSpinner className="content__spinner" />
            </div>
            :
            <div className='w-full relative'>
                <Swiper
                    // loop={true}
                    // autoplay={{ delay: 5000, disableOnInteraction: false }}
                    modules={[Navigation, Scrollbar, A11y, Autoplay]}
                    spaceBetween={50}
                    slidesPerView={2}
                    onSlideChange={handleSlideChange}
                    onSwiper={(swiper) => popularGenreSwiperRef.current = swiper}
                    breakpoints={{
                        1024: {
                            slidesPerView: 3
                        }
                    }}
                >
                    <SwiperSlide>
                        <div className="w-full">
                            <p title={genres.title} onClick={() => handleSelectPopularGenre("")} className={`w-fit max-w-[150px] text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer ${activeTab === "" ? "border-b-2 border-indigo-400" : ""}`}>All</p>
                        </div>
                    </SwiperSlide>
                    {
                        genres.map((genre: GENRE_TYPE) => (
                            <SwiperSlide key={genre.id}>
                                <div className="w-full">
                                    <p title={genre.title} onClick={() => handleSelectPopularGenre(genre.id)} className={`w-fit max-w-[150px] text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer ${activeTab === genre.id ? "border-b-2 border-indigo-400" : ""}`}>{genre.title}</p>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>

                <PopularGenreSliderButton popularGenreSwiperRef={popularGenreSwiperRef} handleSlidePrevSlide={handleSlidePrevSlide} handleSlideNextSlide={handleSlideNextSlide} showSliderButton={showSliderButton} />
            </div>
    )
}

export default PopularGenreSlider
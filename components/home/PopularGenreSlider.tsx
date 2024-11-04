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
import { fetchAllGenres, useGenreStore } from "@/store/GenreStore";
import { ImSpinner } from "react-icons/im";
import { useBookStore } from "@/store/BookStore";
import { RecordModel } from "pocketbase";

const PopularGenreSlider = () => {
    const popularGenreSwiperRef = useRef<any>(null);
    const [showSliderButton, setShowSliderButton] = useState({
        prevBtn: false,
        nextBtn: true
    });

    // Book store
    const emptyPopGenreBooks = useBookStore((state: any) => state.emptyPopGenreBooks);

    // Genre store
    const activeGenre = useGenreStore((state: any) => state.activeGenre);
    const updateActiveGenre = useGenreStore((state: any) => state.updateActiveGenre);
    const reRenderGenre = useGenreStore((state: any) => state.reRenderGenre);
    const updateReRenderGenre = useGenreStore((state: any) => state.updateReRenderGenre);
    const genres = useGenreStore((state: any) => state.genres);
    const addGenres = useGenreStore((state: any) => state.addGenres);

    const [currentTab, setCurrentTab] = useState(activeGenre);

    const getAllGenres = async () => {
        const genres: RecordModel[] = await fetchAllGenres({searchText: ""});

        if (genres) {
            for (let i=0; i<genres.length; i++) {
                const genre: RecordModel = genres[i];

                addGenres(genre);
            }
        }

        updateReRenderGenre(false);
    }

    useEffect(() => {
        if (reRenderGenre) {
            getAllGenres();
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
        if (currentTab === tab) return;

        updateActiveGenre(tab);
        setCurrentTab(tab);

        emptyPopGenreBooks();
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
                            <p title={genres.title} onClick={() => handleSelectPopularGenre("")} className={`w-fit max-w-[150px] text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer ${activeGenre === "" ? "border-b-2 border-indigo-400" : ""}`}>All</p>
                        </div>
                    </SwiperSlide>
                    {
                        genres.map((genre: RecordModel) => (
                            <SwiperSlide key={genre.id}>
                                <div className="w-full">
                                    <p title={genre.title} onClick={() => handleSelectPopularGenre(genre.id)} className={`w-fit max-w-[150px] text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer ${activeGenre === genre.id ? "border-b-2 border-indigo-400" : ""}`}>{genre.title}</p>
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
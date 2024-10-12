import { useRef, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

import { POP_GENRES } from "@/data.js";
import PopularGenreSliderButton from "./PopularGenreSliderButton";
import { useGenreStore } from "@/store/GenreStore";

const PopularGenreSlider = () => {
    const popularGenreSwiperRef = useRef<any>(null);
    const [showSliderButton, setShowSliderButton] = useState({
        prevBtn: false,
        nextBtn: true
    });
    
    const activeTab = useGenreStore((state: any) => state.activeTab);
    const updateActiveTab = useGenreStore((state: any) => state.updateActiveTab);

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

    const handleSelectPopularGenre = (tab: number) => {
        updateActiveTab(tab);
    }

    return (
        <div className='w-full relative'>
            <Swiper
                // loop={true}
                // autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Navigation, Scrollbar, A11y, Autoplay]}
                spaceBetween={50}
                slidesPerView={3}
                onSlideChange={handleSlideChange}
                onSwiper={(swiper) => popularGenreSwiperRef.current = swiper}
            >
                <SwiperSlide>
                    <p onClick={() => handleSelectPopularGenre(-1)} className={`w-fit text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer ${activeTab === -1 ? "border-b-2 border-indigo-400" : ""}`}>All</p>
                </SwiperSlide>
                {
                    POP_GENRES.map(genre => (
                        <SwiperSlide key={genre.id}>
                            <p onClick={() => handleSelectPopularGenre(genre.id)} className={`w-fit text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer ${activeTab === genre.id ? "border-b-2 border-indigo-400" : ""}`}>{genre.title}</p>
                        </SwiperSlide>
                    ))
                }
            </Swiper>

            <PopularGenreSliderButton popularGenreSwiperRef={popularGenreSwiperRef} handleSlidePrevSlide={handleSlidePrevSlide} handleSlideNextSlide={handleSlideNextSlide} showSliderButton={showSliderButton} />
        </div>
    )
}

export default PopularGenreSlider
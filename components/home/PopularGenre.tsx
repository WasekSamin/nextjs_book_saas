
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

import "@/css/home/PopularGenre.css";
import PopularGenreSliderButton from './PopularGenreSliderButton';
import { useRef, useState } from 'react';
import { POP_GENRES } from "@/data.js";

const PopularGenre = () => {
    const popularGenreSwiperRef = useRef<any>(null);
    const [showSliderButton, setShowSliderButton] = useState({
        prevBtn: false,
        nextBtn: true
    });

    const handleSlidePrevSlide = () => {
        if (popularGenreSwiperRef.current) {
            // popularGenreSwiperRef.current.slidePrev();

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
            // popularGenreSwiperRef.current.slideNext();

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

    return (
        <div className="mt-10">
            <div className="grid grid-cols-2 items-center gap-x-5">
                <h5 className="capitalize font-semibold text-xl">Popular by genre</h5>

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
                        {
                            POP_GENRES.map(genre => (
                                <SwiperSlide key={genre.id}>
                                    <p className='text-ellipsis whitespace-nowrap overflow-hidden'>{genre.title}</p>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>

                    <PopularGenreSliderButton popularGenreSwiperRef={popularGenreSwiperRef} handleSlidePrevSlide={handleSlidePrevSlide} handleSlideNextSlide={handleSlideNextSlide} showSliderButton={showSliderButton} />
                </div>
            </div>
        </div>
    )
}

export default PopularGenre
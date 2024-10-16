"use client";

import { BOOKS } from "@/data"
import Image from "next/image"
import Link from "next/link"
import { FaRegHeart } from "react-icons/fa"
import { Tooltip } from "react-tooltip"

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import { useRef, useState } from "react";
import FavouriteBookSliderButton from "./FavouriteBookSliderButton";

const ProfileFavouriteBooks = () => {
    const favouriteBookSwiperRef = useRef<any>(null);
    const [showSliderButton, setShowSliderButton] = useState({
        prevBtn: false,
        nextBtn: true
    });

    const handleSlidePrevSlide = () => {
        if (favouriteBookSwiperRef.current) {
            if (!favouriteBookSwiperRef.current.isEnd) {
                setShowSliderButton({
                    prevBtn: true,
                    nextBtn: true
                });
            }
            if (favouriteBookSwiperRef.current.isBeginning) {
                setShowSliderButton({
                    prevBtn: false,
                    nextBtn: true
                });
            }
        }
    }

    const handleSlideNextSlide = () => {
        if (favouriteBookSwiperRef.current) {
            if (!favouriteBookSwiperRef.current.isBeginning) {
                setShowSliderButton({
                    prevBtn: true,
                    nextBtn: true
                });
            }
            if (favouriteBookSwiperRef.current.isEnd) {
                setShowSliderButton({
                    prevBtn: true,
                    nextBtn: false
                });
            }
        }
    }


    return (
        <div className="mt-20">
            <div className='flex flex-col gap-y-5'>
                <h5 className='font-semibold text-xl md:text-2xl'>Favourite Books</h5>

                <div className='mt-10'>
                    <Swiper
                        modules={[Navigation, Scrollbar, A11y, Autoplay]}
                        grabCursor={true}
                        loop={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        spaceBetween={50}
                        slidesPerView={1}
                        onSwiper={(swiper) => favouriteBookSwiperRef.current = swiper}
                        breakpoints={{
                            460: {
                                slidesPerView: 2
                            },
                            768: {
                                slidesPerView: 3
                            },
                            992: {
                                slidesPerView: 4
                            }
                        }}
                    >
                        {
                            BOOKS.map(book => (
                                <SwiperSlide key={book.id}>
                                    <div className='flex flex-col gap-y-5'>
                                        <Link href={`/book/${book.id}`}>
                                            <Image src={book.image} width={180} height={260} className='mx-auto min-[460px]:mx-0 min-w-[180px] min-h-[260px] w-[180px] h-[260px] object-cover' alt={`${book.title} Image`} />
                                        </Link>
                                        <div className='flex flex-col gap-y-3'>
                                            <div className="flex items-center justify-between gap-x-5">
                                                <Link href={`/book/${book.id}`} className='font-semibold text-base md:text-lg'>{book.title}</Link>
                                                <div>
                                                    <FaRegHeart data-tooltip-id={`fav__book-${book.id}`} data-tooltip-content="Add to favorite" className="text-danger text-lg cursor-pointer" />
                                                    <Tooltip id={`fav__book-${book.id}`} className="custom__tooltip" />
                                                </div>
                                            </div>

                                            {
                                                book.author &&
                                                <Link href={`/author/${book.author.id}`} className="w-fit font-medium"><span className="font-normal">By</span> {book.author.name}</Link>
                                            }
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>

                    <FavouriteBookSliderButton favouriteBookSwiperRef={favouriteBookSwiperRef} handleSlidePrevSlide={handleSlidePrevSlide} handleSlideNextSlide={handleSlideNextSlide} />
                </div>
            </div>
        </div>
    )
}

export default ProfileFavouriteBooks
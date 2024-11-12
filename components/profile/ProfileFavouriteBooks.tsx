"use client";

import Image from "next/image"
import Link from "next/link"
import { FaHeart, FaRegHeart } from "react-icons/fa"

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import { useEffect, useRef, useState } from "react";
import FavouriteBookSliderButton from "./FavouriteBookSliderButton";
import { fetchFavouriteBooks, useBookStore } from "@/store/BookStore";
import { ListResult, RecordModel } from "pocketbase";
import pb from "@/store/PocketbaseStore";
import { updateBookFavouriteMode } from "@/utils/favouriteBookFunc";
import { ImSpinner } from "react-icons/im";

const ProfileFavouriteBooks = () => {
    // Book store
    const favouriteBooks = useBookStore((state: any) => state.favouriteBooks);
    const updateIsFavouriteBookDataFetching = useBookStore((state: any) => state.updateIsFavouriteBookDataFetching);
    const addFavouriteBook = useBookStore((state: any) => state.addFavouriteBook);
    const reRenderFavouriteBooks = useBookStore((state: any) => state.reRenderFavouriteBooks);
    const updateReRenderFavouriteBooks = useBookStore((state: any) => state.updateReRenderFavouriteBooks);
    const favouriteBookPage = useBookStore((state: any) => state.favouriteBookPage);
    const updateFavouriteBookPage = useBookStore((state: any) => state.updateFavouriteBookPage);
    const isFavouriteBookSubmitting = useBookStore((state: any) => state.isFavouriteBookSubmitting);
    const updateIsFavouriteBookSubmitting = useBookStore((state: any) => state.updateIsFavouriteBookSubmitting);
    const removeFavouriteBook = useBookStore((state: any) => state.removeFavouriteBook);
    const emptyPopGenreBooks = useBookStore((state: any) => state.emptyPopGenreBooks);

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

    const getFavouriteBooks = async (page: number) => {
        updateIsFavouriteBookDataFetching(true);

        const { items: favBooks }: any = await fetchFavouriteBooks({ page: page });

        if (favBooks) {
            for (let i = 0; i < favBooks.length; i++) {
                const favBook: RecordModel = favBooks[i];

                const { book }: any = favBook?.expand;

                if (book) {
                    book.is_favourite = true;

                    const { authors } = book?.expand;

                    if (authors) {
                        book.authors = authors;
                    }
                }

                addFavouriteBook(book);
            }
        }

        updateReRenderFavouriteBooks(false);
        updateIsFavouriteBookDataFetching(false);
        updateFavouriteBookPage(page);
    }

    useEffect(() => {
        if (reRenderFavouriteBooks) {
            getFavouriteBooks(favouriteBookPage);
        }
    }, [reRenderFavouriteBooks])

    const handleFavouriteBook = async ({ book, isFav }: { book: RecordModel, isFav: boolean }) => {
        updateIsFavouriteBookSubmitting(true);

        const favouriteBook: RecordModel = await updateBookFavouriteMode({
            book: book,
            isFav: isFav
        });

        removeFavouriteBook(favouriteBook);
        updateIsFavouriteBookSubmitting(false);
        emptyPopGenreBooks();
    }


    return (
        <div className="mt-20">
            {
                reRenderFavouriteBooks ?
                    <div className="w-full flex items-center justify-center">
                        <ImSpinner className="page__spinner" />
                    </div> :
                    <div className='flex flex-col gap-y-5'>
                        <h5 className='font-semibold text-xl md:text-2xl'>Favourite Books</h5>

                        {
                            favouriteBooks.length > 0 ?
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
                                            favouriteBooks.map((book: RecordModel) => (
                                                <SwiperSlide key={book.id}>
                                                    <div className='flex flex-col gap-y-5'>
                                                        <Link href={`/book/${book.id}`}>
                                                            <Image src={pb.files.getUrl(book, book.thumbnail, { 'thumb': '180x260' })} width={180} height={260} className='mx-auto min-[460px]:mx-0 min-w-[180px] min-h-[260px] w-[180px] h-[260px] object-cover' alt={`${book.title} Image`} />
                                                        </Link>
                                                        <div className='flex flex-col gap-y-3'>
                                                            <div className="flex items-center justify-between gap-x-5">
                                                                <Link href={`/book/${book.id}`} className='font-semibold text-base md:text-lg three-line-text'>{book.title}</Link>
                                                                <button disabled={isFavouriteBookSubmitting} type="button" onClick={() => handleFavouriteBook({ book: book, isFav: !book.is_favourite })} className="w-fit h-fit outline-none">
                                                                    {
                                                                        book.is_favourite ?
                                                                            <FaHeart data-tooltip-id={`fav__book-${book.id}`} data-tooltip-content="Remove from favourite" className="text-danger text-lg cursor-pointer" />
                                                                            :
                                                                            <FaRegHeart data-tooltip-id={`fav__book-${book.id}`} data-tooltip-content="Add to favourite" className="text-danger text-lg cursor-pointer" />
                                                                    }
                                                                </button>
                                                            </div>

                                                            {
                                                                book.authors?.length &&
                                                                <div className="flex flex-wrap gap-0.5">
                                                                    <span>By </span>
                                                                    {
                                                                        book.authors.map((author: RecordModel, index: number) => (
                                                                            <Link key={author.id} href={`/author/${author.id}`} className="w-fit font-medium">{author.name}{index !== book.authors.length - 1 && ","}</Link>
                                                                        ))
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>

                                    <FavouriteBookSliderButton favouriteBookSwiperRef={favouriteBookSwiperRef} handleSlidePrevSlide={handleSlidePrevSlide} handleSlideNextSlide={handleSlideNextSlide} />
                                </div> :
                                <p>No books found in your favourite list!</p>
                        }
                    </div>
            }
        </div>
    )
}

export default ProfileFavouriteBooks
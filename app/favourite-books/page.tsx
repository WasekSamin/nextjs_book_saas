"use client";

import Footer from '@/components/footer/Footer'
import Navbar from '@/components/header/Navbar'
import { fetchFavouriteBooks, useBookStore } from '@/store/BookStore';
import { usePageStore } from '@/store/PageStore';
import { pb } from '@/store/PocketbaseStore';
import { updateBookFavouriteMode } from '@/utils/favouriteBookFunc';
import { RichTextElement } from '@/utils/RichTextElement'
import Image from 'next/image'
import Link from 'next/link'
import { ListResult, RecordModel } from 'pocketbase';
import React, { useEffect, useRef } from 'react'
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from 'react-icons/fa'
import { ImSpinner } from 'react-icons/im';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from 'react-tooltip'

const FavouriteBooks = () => {
    const { ref: favouriteBookRef, inView: favouriteBookInView, entry: favouriteBookEntry } = useInView({
        /* Optional options */
        triggerOnce: true,
        threshold: 0,
    });

    // Book store
    const reRenderFavouriteBooks = useBookStore((state: any) => state.reRenderFavouriteBooks);
    const updateReRenderFavouriteBooks = useBookStore((state: any) => state.updateReRenderFavouriteBooks);
    const isFavouriteBookDataFetching = useBookStore((state: any) => state.isFavouriteBookDataFetching);
    const updateIsFavouriteBookDataFetching = useBookStore((state: any) => state.updateIsFavouriteBookDataFetching);
    const favouriteBooks = useBookStore((state: any) => state.favouriteBooks);
    const addFavouriteBook = useBookStore((state: any) => state.addFavouriteBook);
    const favouriteBookPage = useBookStore((state: any) => state.favouriteBookPage);
    const updateFavouriteBookPage = useBookStore((state: any) => state.updateFavouriteBookPage);
    const isFavouriteBookSubmitting = useBookStore((state: any) => state.isFavouriteBookSubmitting);
    const updateIsFavouriteBookSubmitting = useBookStore((state: any) => state.updateIsFavouriteBookSubmitting);
    const removeFavouriteBook = useBookStore((state: any) => state.removeFavouriteBook);
    const emptyPopGenreBooks = useBookStore((state: any) => state.emptyPopGenreBooks);
    const emptyPurchasedBooks = useBookStore((state: any) => state.emptyPurchasedBooks);

    const controllerRef = useRef<AbortController>();
    const favouriteBookControllerRef = useRef<AbortController>();

    // Page store
    const isPageLoading = usePageStore((state: any) => state.isPageLoading);

    const getFavouriteBooks = async (page: number) => {
        updateIsFavouriteBookDataFetching(true);

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const { items: favBooks }: any = await fetchFavouriteBooks({ page: page, signal: signal });

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
    }

    const loadFavouriteBookInView = async () => {
        updateFavouriteBookPage(favouriteBookPage + 1);
        await getFavouriteBooks(favouriteBookPage + 1);
    }

    useEffect(() => {
        if (reRenderFavouriteBooks) {
            getFavouriteBooks(favouriteBookPage);
        }
    }, [reRenderFavouriteBooks])

    useEffect(() => {
        favouriteBookInView && loadFavouriteBookInView();
    }, [favouriteBookInView])

    const handleFavouriteBook = async ({ book, isFav }: { book: RecordModel, isFav: boolean }) => {
        updateIsFavouriteBookSubmitting(true);

        if (favouriteBookControllerRef.current) {
            favouriteBookControllerRef.current.abort();
        }

        favouriteBookControllerRef.current = new AbortController();
        const signal = favouriteBookControllerRef.current.signal;

        const favouriteBook: RecordModel = await updateBookFavouriteMode({
            book: book,
            isFav: isFav,
            signal: signal
        });

        removeFavouriteBook(favouriteBook);
        updateIsFavouriteBookSubmitting(false);
        emptyPopGenreBooks();
        emptyPurchasedBooks();
    }

    return (
        isPageLoading ?
            <div className="w-full h-svh flex items-center justify-center">
                <ImSpinner className="page__spinner" />
            </div> :
            <>
                <Navbar />

                <div className="base-layout container mx-auto">
                    <div className='flex flex-col gap-y-5'>
                        <h5 className='font-semibold text-xl md:text-2xl'>Favourite Books</h5>

                        <div className='mt-20'>
                            {
                                reRenderFavouriteBooks ?
                                    <div className="w-full flex items-center justify-center">
                                        <ImSpinner className="page__spinner" />
                                    </div> :
                                    favouriteBooks?.length > 0 ?
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-20">
                                                {
                                                    favouriteBooks.map((book: any, index: number) => (
                                                        <div key={book.id}>
                                                            <div className="p-5 rounded-md border border-theme">
                                                                <div className="flex flex-col lg:flex-row gap-5">
                                                                    <Link href={`book/${book.id}`} className="translate-y-[-25%]">
                                                                        <Image src={pb.files.getUrl(book, book.thumbnail, { 'thumb': '180x260' })} width={180} height={260} className='min-w-full w-full lg:w-[180px] lg:min-w-[180px] h-[260px] min-h-[260px] object-contain lg:object-cover' alt={`${book.title} Image`} />
                                                                    </Link>
                                                                    <div className="w-full flex flex-row lg:flex-col lg:items-start justify-between lg:justify-start gap-y-5 book__customMargin">
                                                                        {
                                                                            pb?.authStore?.model &&
                                                                            <div className="lg:w-full flex justify-end order-2 lg:order-1">
                                                                                <button disabled={isFavouriteBookSubmitting} type="button" onClick={() => handleFavouriteBook({ book: book, isFav: !book.is_favourite })} className="w-fit h-fit outline-none">
                                                                                    {
                                                                                        book.is_favourite ?
                                                                                            <FaHeart data-tooltip-id={`fav__book-${book.id}`} data-tooltip-content="Remove from favourite" className="text-danger text-lg cursor-pointer" />
                                                                                            :
                                                                                            <FaRegHeart data-tooltip-id={`fav__book-${book.id}`} data-tooltip-content="Add to favourite" className="text-danger text-lg cursor-pointer" />
                                                                                    }
                                                                                </button>
                                                                                <Tooltip id={`fav__book-${book.id}`} className="custom__tooltip" />
                                                                            </div>
                                                                        }

                                                                        <div className="flex flex-col gap-y-5 order-1 lg:order-2">
                                                                            <Link href={`/book/${book.id}`} className="w-fit text-base md:text-lg font-semibold three-line-text">{book.title}</Link>
                                                                            <div className="flex flex-col gap-y-3">
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
                                                                                <div className='flex items-center gap-x-1 text-yellow-400 text-base'>
                                                                                    {
                                                                                        book.rating >= 1 ? <FaStar /> : <FaRegStar />
                                                                                    }
                                                                                    {
                                                                                        book.rating >= 2 ? <FaStar /> : <FaRegStar />
                                                                                    }
                                                                                    {
                                                                                        book.rating >= 3 ? <FaStar /> : <FaRegStar />
                                                                                    }
                                                                                    {
                                                                                        book.rating >= 4 ? <FaStar /> : <FaRegStar />
                                                                                    }
                                                                                    {
                                                                                        book.rating >= 5 ? <FaStar /> : <FaRegStar />
                                                                                    }
                                                                                </div>
                                                                                <div className='custom__list three-line-text'>
                                                                                    <RichTextElement content={book.description} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                index === favouriteBooks.length - 1 &&
                                                                <div ref={favouriteBookRef} className="invisible opacity-0 z-[-1]"></div>
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            {
                                                isFavouriteBookDataFetching &&
                                                <div className="mt-5 w-full flex items-center justify-center">
                                                    <ImSpinner className="page__spinner" />
                                                </div>
                                            }
                                        </> : <p>No favourite book yet!</p>
                            }
                        </div>
                    </div>
                </div>

                <Footer />
            </>
    )
}

export default FavouriteBooks
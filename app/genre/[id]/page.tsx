"use client";

import Footer from '@/components/footer/Footer'
import Navbar from '@/components/header/Navbar'
import { fetchBooks, useBookStore } from '@/store/BookStore';
import { fetchGenreDetails, useGenreStore } from '@/store/GenreStore';
import { usePageStore } from '@/store/PageStore';
import pb from '@/store/PocketbaseStore';
import { isFavouriteBook, updateBookFavouriteMode } from '@/utils/favouriteBookFunc';
import { RichTextElement } from '@/utils/RichTextElement'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { RecordModel } from 'pocketbase';
import React, { useEffect, useRef } from 'react'
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from 'react-icons/fa'
import { ImSpinner } from 'react-icons/im';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from 'react-tooltip'

const GenreWiseBook = () => {
    const { id: genreId }: { id: string } = useParams();

    const { ref: genreBookRef, inView: genreBookInView, entry: genreBookEntry } = useInView({
        /* Optional options */
        triggerOnce: true,
        threshold: 0,
    });

    // Page store
    const isPageLoading = usePageStore((state: any) => state.isPageLoading);

    // Genre store
    const genreDetails = useGenreStore((state: any) => state.genreDetails);
    const updateGenreDetails = useGenreStore((state: any) => state.updateGenreDetails);
    const emptyGenreDetails = useGenreStore((state: any) => state.emptyGenreDetails);

    // Book store
    const genreBookPage = useBookStore((state: any) => state.genreBookPage);
    const updateGenreBookPage = useBookStore((state: any) => state.updateGenreBookPage);
    const genreBooks = useBookStore((state: any) => state.genreBooks);
    const addGenreBooks = useBookStore((state: any) => state.addGenreBooks);
    const reRenderGenreBooks = useBookStore((state: any) => state.reRenderGenreBooks);
    const updateReRenderGenreBooks = useBookStore((state: any) => state.updateReRenderGenreBooks);
    const isGenreBookFetching = useBookStore((state: any) => state.isGenreBookFetching);
    const updateIsGenreBookFetching = useBookStore((state: any) => state.updateIsGenreBookFetching);
    const isFavouriteBookSubmitting = useBookStore((state: any) => state.isFavouriteBookSubmitting);
    const updateIsFavouriteBookSubmitting = useBookStore((state: any) => state.updateIsFavouriteBookSubmitting)
    const emptyFavouriteBooks = useBookStore((state: any) => state.emptyFavouriteBooks);
    const emptyGenreBooks = useBookStore((state: any) => state.emptyGenreBooks);

    const getGenreWiseBooks = async (page: number) => {
        updateIsGenreBookFetching(true);

        const { items: books }: any = await fetchBooks({ page: page, genreId: genreId });

        if (books) {
            for (let i = 0; i < books.length; i++) {
                const book: RecordModel = books[i];

                if (pb?.authStore?.model) {
                    const isFav: boolean = await isFavouriteBook({ bookId: book.id });
                    book.is_favourite = isFav;
                }

                const { authors }: any = book?.expand;

                if (authors) {
                    book.authors = authors;
                }
                addGenreBooks(book);
            }
        }

        updateReRenderGenreBooks(false);
        updateIsGenreBookFetching(false);
    }

    const loadGenreBookInView = async () => {
        updateGenreBookPage(genreBookPage + 1);
        await getGenreWiseBooks(genreBookPage + 1);
    }

    const handleFavouriteBook = async ({ book, isFav }: { book: RecordModel, isFav: boolean }) => {
        updateIsFavouriteBookSubmitting(true);

        await updateBookFavouriteMode({
            book: book,
            isFav: isFav
        });

        updateIsFavouriteBookSubmitting(false);
        emptyFavouriteBooks();
    }

    const getGenreDetails = async () => {
        const genre = await fetchGenreDetails({ genreId: genreId });

        if (genre) {
            updateGenreDetails(genre);
        }
    }

    useEffect(() => {
        if (genreId) {
            // Fetch genre details
            getGenreDetails();
            // Fetch genre wise books
            getGenreWiseBooks(1);
        }

        return () => {
            emptyGenreDetails();
            emptyGenreBooks();
        }
    }, [genreId])

    useEffect(() => {
        if (genreBookInView) {
            loadGenreBookInView();
        }
    }, [genreBookInView])

    return (
        isPageLoading ?
            <div className="w-full h-svh flex items-center justify-center">
                <ImSpinner className="page__spinner" />
            </div> :
            <>
                <Navbar />

                <div className="base-layout container mx-auto">
                    <div className='flex flex-col gap-y-5'>
                        <h5 className='font-semibold text-xl md:text-2xl'>{genreDetails?.title}</h5>
                        <div className='mt-20'>
                            {
                                reRenderGenreBooks ?
                                    <div className="w-full flex items-center justify-center">
                                        <ImSpinner className="page__spinner" />
                                    </div> :
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-20">
                                            {
                                                genreBooks?.map((book: RecordModel, index: number) => (
                                                    <div key={book.id} className="p-5 rounded-md border border-theme">
                                                        <div className="flex flex-col lg:flex-row gap-5">
                                                            <Link href={`/book/${book.id}`} className="translate-y-[-25%]">
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
                                                                        <Tooltip id={`genre__book-${book.id}`} className="custom__tooltip" />
                                                                    </div>
                                                                }

                                                                <div className="flex flex-col gap-y-5 order-1 lg:order-2">
                                                                    <Link href={`/book/${book.id}`} className="w-fit text-base md:text-lg font-semibold">{book.title}</Link>
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

                                                        {
                                                            index === genreBooks.length - 1 &&
                                                            <div ref={genreBookRef} className="invisible opacity-0 z-[-1]"></div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        {
                                            isGenreBookFetching &&
                                            <div className="mt-5 w-full flex items-center justify-center">
                                                <ImSpinner className="page__spinner" />
                                            </div>
                                        }
                                    </>
                            }
                        </div>
                    </div>
                </div>

                <Footer />
            </>
    )
}

export default GenreWiseBook
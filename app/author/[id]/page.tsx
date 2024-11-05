"use client";

import Footer from '@/components/footer/Footer'
import Navbar from '@/components/header/Navbar'
import { fetchAuthorDetails, useAuthorStore } from '@/store/AuthorStore';
import { fetchBooks, useBookStore } from '@/store/BookStore';
import { pb } from '@/store/PocketbaseStore';
import { isFavouriteBook, updateBookFavouriteMode } from '@/utils/favouriteBookFunc';
import { RichTextElement } from '@/utils/RichTextElement'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { RecordModel } from 'pocketbase';
import React, { useEffect } from 'react'
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from 'react-icons/fa'
import { ImSpinner } from 'react-icons/im';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from 'react-tooltip'

const AuthorWiseBook = () => {
    const { id: authorId }: { id: string } = useParams();

    const { ref: authorBookRef, inView: authorBookInView, entry: authorBookEntry } = useInView({
        /* Optional options */
        triggerOnce: true,
        threshold: 0,
    });

    // Author store
    const authorDetails = useAuthorStore((state: any) => state.authorDetails);
    const updateAuthorDetails = useAuthorStore((state: any) => state.updateAuthorDetails);
    const emptyAuthorDetails = useAuthorStore((state: any) => state.emptyAuthorDetails);

    // Book store
    const authorBookPage = useBookStore((state: any) => state.authorBookPage);
    const updateAuthorBookPage = useBookStore((state: any) => state.updateAuthorBookPage);
    const authorBooks = useBookStore((state: any) => state.authorBooks);
    const addAuthorBooks = useBookStore((state: any) => state.addAuthorBooks);
    const emptyAuthorBooks = useBookStore((state: any) => state.emptyAuthorBooks);
    const reRenderAuthorBooks = useBookStore((state: any) => state.reRenderAuthorBooks);
    const updateReRenderAuthorBooks = useBookStore((state: any) => state.updateReRenderAuthorBooks);
    const isAuthorBookFetching = useBookStore((state: any) => state.isAuthorBookFetching);
    const updateIsAuthorBookFetching = useBookStore((state: any) => state.updateIsAuthorBookFetching);
    const updateIsFavouriteBookSubmitting = useBookStore((state: any) => state.updateIsFavouriteBookSubmitting);
    const isFavouriteBookSubmitting = useBookStore((state: any) => state.isFavouriteBookSubmitting);
    const emptyFavouriteBooks = useBookStore((state: any) => state.emptyFavouriteBooks);

    const getAuthorWiseBooks = async (page: number) => {
        updateIsAuthorBookFetching(true);

        const { items: books }: any = await fetchBooks({ page: page, authorId: authorId });

        if (books) {
            for (let i = 0; i < books.length; i++) {
                const book: RecordModel = books[i];

                const isFav: boolean = await isFavouriteBook(book.id);
                book.is_favourite = isFav;
                const { authors }: any = book?.expand;

                if (authors) {
                    book.authors = authors;
                }
                addAuthorBooks(book);
            }
        }

        updateReRenderAuthorBooks(false);
        updateIsAuthorBookFetching(false);
    }

    const loadAuthorBookInView = async () => {
        updateAuthorBookPage(authorBookPage + 1);
        await getAuthorWiseBooks(authorBookPage + 1);
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

    const getAuthorDetails = async () => {
        const author = await fetchAuthorDetails(authorId);

        if (author) {
            updateAuthorDetails(author);
        }
    }

    useEffect(() => {
        if (authorId) {
            // Fetch author details
            getAuthorDetails();
            // Fetch author wise books
            getAuthorWiseBooks(1);
        }

        return () => {
            emptyAuthorDetails();
            emptyAuthorBooks();
        }
    }, [authorId])

    useEffect(() => {
        authorBookInView && loadAuthorBookInView();
    }, [authorBookInView])

    return (
        <>
            <Navbar />

            <div className="base-layout container mx-auto">
                <div className='flex flex-col gap-y-5'>
                    <h5 className='font-semibold text-xl md:text-2xl'>{authorDetails?.name}</h5>

                    <div className='mt-20'>
                        {
                            reRenderAuthorBooks ?
                                <div className="w-full flex items-center justify-center">
                                    <ImSpinner className="page__spinner" />
                                </div> :
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-20">
                                        {
                                            authorBooks?.map((book: RecordModel, index: number) => (
                                                <div key={book.id} className="p-5 rounded-md border border-theme">
                                                    <div className="flex flex-col lg:flex-row gap-5">
                                                        <Link href={`/book/${book.id}`} className="translate-y-[-25%]">
                                                            <Image src={pb.files.getUrl(book, book.thumbnail, { 'thumb': '180x260' })} width={180} height={260} className='min-w-full w-full lg:w-[180px] lg:min-w-[180px] h-[260px] min-h-[260px] object-contain lg:object-cover' alt={`${book.title} Image`} />
                                                        </Link>
                                                        <div className="w-full flex flex-row lg:flex-col lg:items-start justify-between lg:justify-start gap-y-5 book__customMargin">
                                                            <div className="lg:w-full flex justify-end order-2 lg:order-1">
                                                                <button disabled={isFavouriteBookSubmitting} type="button" onClick={() => handleFavouriteBook({ book: book, isFav: !book.is_favourite })} className="w-fit h-fit outline-none">
                                                                    {
                                                                        book.is_favourite ?
                                                                            <FaHeart data-tooltip-id={`fav__book-${book.id}`} data-tooltip-content="Remove from favourite" className="text-danger text-lg cursor-pointer" />
                                                                            :
                                                                            <FaRegHeart data-tooltip-id={`fav__book-${book.id}`} data-tooltip-content="Add to favourite" className="text-danger text-lg cursor-pointer" />
                                                                    }
                                                                </button>
                                                            </div>

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
                                                        index === authorBooks.length - 1 &&
                                                        <div ref={authorBookRef} className="invisible opacity-0 z-[-1]"></div>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {
                                        isAuthorBookFetching &&
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

export default AuthorWiseBook
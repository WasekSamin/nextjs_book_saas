"use client";

import Footer from '@/components/footer/Footer'
import Navbar from '@/components/header/Navbar'
import { BOOKS } from '@/data'
import { fetchPurchasedBooks, useBookStore } from '@/store/BookStore';
import { pb } from '@/store/PocketbaseStore';
import { isFavouriteBook, updateBookFavouriteMode } from '@/utils/favouriteBookFunc';
import { RichTextElement } from '@/utils/RichTextElement'
import Image from 'next/image'
import Link from 'next/link'
import { RecordModel } from 'pocketbase';
import React, { useEffect } from 'react'
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from 'react-icons/fa'
import { ImSpinner } from 'react-icons/im';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from 'react-tooltip'

const PurchasedBooks = () => {
    // Book store
    const purchasedBooks = useBookStore((state: any) => state.purchasedBooks);
    const addPurchasedBook = useBookStore((state: any) => state.addPurchasedBook);
    const purchasedBookPage = useBookStore((state: any) => state.purchasedBookPage);
    const updatePurchasedBookPage = useBookStore((state: any) => state.updatePurchasedBookPage);
    const isPurchasedBooksFetching = useBookStore((state: any) => state.isPurchasedBooksFetching);
    const updateIsPurcasedBooksFetching = useBookStore((state: any) => state.updateIsPurcasedBooksFetching);
    const reRenderPurchasedBooks = useBookStore((state: any) => state.reRenderPurchasedBooks);
    const updateReRenderPurchasedBooks = useBookStore((state: any) => state.updateReRenderPurchasedBooks);
    const isFavouriteBookSubmitting = useBookStore((state: any) => state.isFavouriteBookSubmitting);
    const updateIsFavouriteBookSubmitting = useBookStore((state: any) => state.updateIsFavouriteBookSubmitting);
    const emptyFavouriteBooks = useBookStore((state: any) => state.emptyFavouriteBooks);

    const { ref: purchasedBookRef, inView: purchasedBookInView, entry: purchasedBookEntry } = useInView({
        /* Optional options */
        triggerOnce: true,
        threshold: 0,
    });

    const getPurchasedBooks = async (page: number) => {
        updateIsPurcasedBooksFetching(true);

        const { items: purchasedBookList }: any = await fetchPurchasedBooks({ page: page });

        if (purchasedBookList) {
            for (let i = 0; i < purchasedBookList.length; i++) {
                const purchasedBook: RecordModel = purchasedBookList[i];

                const { book }: any = purchasedBook?.expand;

                if (book) {
                    const isFav: boolean = await isFavouriteBook(book.id);
                    book.is_favourite = isFav;
                    const { authors }: any = book?.expand;

                    if (authors) {
                        book.authors = authors;
                    }
                    addPurchasedBook(book);
                }
            }
        }

        updateReRenderPurchasedBooks(false);
        updateIsPurcasedBooksFetching(false);
    }

    const loadPurchasedBookInView = async () => {
        updatePurchasedBookPage(purchasedBookPage + 1);
        await getPurchasedBooks(purchasedBookPage + 1);
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

    useEffect(() => {
        if (reRenderPurchasedBooks) {
            getPurchasedBooks(1);
        }
    }, [reRenderPurchasedBooks])

    useEffect(() => {
        purchasedBookInView && loadPurchasedBookInView();
    }, [purchasedBookInView])

    return (
        <>
            <Navbar />

            <div className="base-layout container mx-auto">
                <div className='flex flex-col gap-y-5'>
                    <h5 className='font-semibold text-xl md:text-2xl'>Purchased Books</h5>

                    <div className='mt-20'>
                        {
                            reRenderPurchasedBooks ?
                                <div className="w-full flex items-center justify-center">
                                    <ImSpinner className="page__spinner" />
                                </div> :
                                purchasedBooks?.length > 0 ?
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-20">
                                            {
                                                purchasedBooks.map((book: RecordModel, index: number) => (
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
                                                                    <Tooltip id={`purchased__book-${book.id}`} className="custom__tooltip" />
                                                                </div>

                                                                <div className="flex flex-col gap-y-5 order-1 lg:order-2">
                                                                    <Link href={`/book/${book.id}`} className="w-fit text-base md:text-lg font-semibold">{book.title}</Link>
                                                                    <div className="flex flex-col gap-y-3">
                                                                        {
                                                                            book.author &&
                                                                            <Link href={`/author/${book.author.id}`} className="w-fit font-medium"><span className='font-normal'>By</span> {book.author.name}</Link>
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
                                                            index === purchasedBooks.length - 1 &&
                                                            <div ref={purchasedBookRef} className="invisible opacity-0 z-[-1]"></div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        {
                                            isPurchasedBooksFetching &&
                                            <div className="mt-5 w-full flex items-center justify-center">
                                                <ImSpinner className="page__spinner" />
                                            </div>
                                        }
                                    </> : <p>No book purchased yet!</p>
                        }
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default PurchasedBooks
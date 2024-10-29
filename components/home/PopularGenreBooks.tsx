import { fetchBooks, useBookStore } from "@/store/BookStore";
import { pb } from "@/store/PocketbaseStore";
import { useThemeStore } from "@/store/ThemeStore";
import { addToFavouriteBookList, fetchFavouriteBook, isDeletedFavouriteBook, isFavouriteBook } from "@/utils/favouriteBookFunc";
import { RichTextElement } from "@/utils/RichTextElement";
import { makeToast } from "@/utils/toastMesage";
import Image from "next/image"
import Link from "next/link";
import { ListResult, RecordModel } from "pocketbase";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from "react-icons/fa"
import { ImSpinner } from "react-icons/im";
import { Tooltip } from 'react-tooltip';

const PopularGenreBooks = () => {
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
    const popGenreBooks = useBookStore((state: any) => state.popGenreBooks);
    const addPopGenreBook = useBookStore((state: any) => state.addPopGenreBook);
    const reRenderPopGenreBooks = useBookStore((state: any) => state.reRenderPopGenreBooks);
    const updateReRenderPopGenreBooks = useBookStore((state: any) => state.updateReRenderPopGenreBooks);
    const isPopGenreBookDataFetching = useBookStore((state: any) => state.isPopGenreBookDataFetching);
    const updateIsPopGenreBookDataFetching = useBookStore((state: any) => state.updateIsPopGenreBookDataFetching);
    const popGenreBookPage = useBookStore((state: any) => state.popGenreBookPage);
    const updatePopGenreBookPage = useBookStore((state: any) => state.updatePopGenreBookPage);
    const isFavouriteBookSubmitting = useBookStore((state: any) => state.isFavouriteBookSubmitting);
    const updateIsFavouriteBookSubmitting = useBookStore((state: any) => state.updateIsFavouriteBookSubmitting);
    const updatePopGenreBook = useBookStore((state: any) => state.updatePopGenreBook);
    const popGenreBookTotalPage = useBookStore((state: any) => state.popGenreBookTotalPage);
    const updatePopGenreBookTotalPage = useBookStore((state: any) => state.updatePopGenreBookTotalPage);

    const popGenreBookRef = useRef(null);

    const fetchGenreBooks = async (page: number) => {
        const {items: books, totalPages}: any = await fetchBooks(page);

        books?.map(async (book: RecordModel) => {
            const isFav: boolean = await isFavouriteBook(book.id);
            book["is_favourite"] = isFav;
            addPopGenreBook(book);
        });

        updateReRenderPopGenreBooks(false);
        updateIsPopGenreBookDataFetching(false);
        updatePopGenreBookTotalPage(totalPages);
        popGenreBookIntersectionObserver();
    }

    const popGenreBookIntersectionObserver = () => {
        updateIsPopGenreBookDataFetching(true);

        const popGenreBookObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updatePopGenreBookPage(popGenreBookPage + 1);
                    fetchGenreBooks(popGenreBookPage + 1);
                }
            })
        }, {
            threshold: 0.3
        })

        if (popGenreBookRef.current) {
            popGenreBookObserver.observe(popGenreBookRef.current);
        }
    }

    useEffect(() => {
        if (reRenderPopGenreBooks) {
            fetchGenreBooks(popGenreBookPage);
        }
    }, [])

    useEffect(() => {
        popGenreBookIntersectionObserver();
    }, [popGenreBookRef.current])

    const handleFavouriteBook = async ({ book, isFav }: { book: RecordModel, isFav: boolean }) => {
        updateIsFavouriteBookSubmitting(true);

        book.is_favourite = isFav;

        if (isFav) {
            const favBookRecord = await addToFavouriteBookList(book.id);

            if (favBookRecord) {
                updatePopGenreBook(book);
            }
        } else {
            const isDeleted = await isDeletedFavouriteBook(book.id);

            if (isDeleted) {
                updatePopGenreBook(book);
            } else {
                makeToast({
                    toastType: "error",
                    msg: "Failed to remove from your favourite list!",
                    isDark: isDarkMode
                });
            }
        }

        updateIsFavouriteBookSubmitting(false);
    }

    return (
        <div className="mt-20">
            {
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-20">
                        {
                            popGenreBooks?.map((book: any, index: number) => (
                                <div key={book.id}>
                                    <div className="p-5 rounded-md border border-theme">
                                        <div className="flex flex-col lg:flex-row gap-5">
                                            <Link href={`book/${book.id}`} className="translate-y-[-25%]">
                                                <Image src={pb.files.getUrl(book, book.thumbnail, { 'thumb': '180x260' })} width={180} height={260} className='min-w-full w-full lg:w-[180px] lg:min-w-[180px] h-[260px] min-h-[260px] object-contain lg:object-cover' alt={`${book.title} Image`} />
                                            </Link>
                                            <div className="w-full flex flex-row lg:flex-col lg:items-start justify-between lg:justify-start gap-y-5 translate-y-[-40%] lg:translate-y-0">
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

                                                <div className="flex flex-col gap-y-5 order-1 lg:order-2">
                                                    <Link href={`/book/${book.id}`} className="w-fit text-base md:text-lg font-semibold three-line-text">{book.title}</Link>
                                                    <div className="flex flex-col gap-y-3">
                                                        {
                                                            book.author &&
                                                            <Link href={`/author/${book.author.id}`} className="w-fit font-medium">{book.author.name}</Link>
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
                                        index === popGenreBooks.length - 1 && popGenreBookTotalPage !== popGenreBookPage &&
                                        <div ref={popGenreBookRef} className="invisible opacity-0 z-[-1]"></div>
                                    }
                                </div>
                            ))
                        }
                    </div>

                    {
                        isPopGenreBookDataFetching &&
                        <div className="mt-5 w-full flex items-center justify-center">
                            <ImSpinner className="page__spinner" />
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default PopularGenreBooks
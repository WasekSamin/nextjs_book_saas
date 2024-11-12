import { fetchBooks, useBookStore } from "@/store/BookStore";
import pb from "@/store/PocketbaseStore";
import { RichTextElement } from "@/utils/RichTextElement";
import Image from "next/image"
import Link from "next/link";
import { RecordModel } from "pocketbase";
import { useEffect, useRef } from "react";
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from "react-icons/fa"
import { ImSpinner } from "react-icons/im";
import { Tooltip } from 'react-tooltip';
import { useInView } from "react-intersection-observer";
import { useGenreStore } from "@/store/GenreStore";
import { isFavouriteBook, updateBookFavouriteMode } from "@/utils/favouriteBookFunc";

const PopularGenreBooks = () => {
    // Book store
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
    const emptyFavouriteBooks = useBookStore((state: any) => state.emptyFavouriteBooks);
    const emptyPurchasedBooks = useBookStore((state: any) => state.emptyPurchasedBooks);

    // Genre store
    const activeGenre = useGenreStore((state: any) => state.activeGenre);

    const { ref: popGenreBookRef, inView: popGenreBookInView, entry: popGenreBookEntry } = useInView({
        /* Optional options */
        triggerOnce: true,
        threshold: 0,
    });

    const fetchGenreBooks = async (page: number) => {
        updateIsPopGenreBookDataFetching(true);

        const { items: books }: any = await fetchBooks({ page: page, genreId: activeGenre });

        console.log("BOOKS", books)

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
                addPopGenreBook(book);
            }
        }

        updateReRenderPopGenreBooks(false);
        updateIsPopGenreBookDataFetching(false);
    }

    const loadPopGenreBookInView = async () => {
        updatePopGenreBookPage(popGenreBookPage + 1);
        await fetchGenreBooks(popGenreBookPage + 1);
    }

    useEffect(() => {
        if (reRenderPopGenreBooks) {
            fetchGenreBooks(1);
        }
    }, [reRenderPopGenreBooks])

    useEffect(() => {
        if (popGenreBookInView) {
            loadPopGenreBookInView();
        }
    }, [popGenreBookInView])

    const handleFavouriteBook = async ({ book, isFav }: { book: RecordModel, isFav: boolean }) => {
        updateIsFavouriteBookSubmitting(true);

        await updateBookFavouriteMode({
            book: book,
            isFav: isFav
        });

        updateIsFavouriteBookSubmitting(false);
        emptyFavouriteBooks();
        emptyPurchasedBooks();
    }

    return (
        <div className="mt-20">
            {
                reRenderPopGenreBooks ?
                    <div className="w-full flex items-center justify-center">
                        <ImSpinner className="page__spinner" />
                    </div> :
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
                                                <div className="w-full flex flex-row lg:flex-col lg:items-start justify-between lg:justify-start gap-y-5 book__customMargin">
                                                    {
                                                        pb?.authStore?.model &&
                                                        <div className="ml-5 lg:w-full flex justify-end order-2 lg:order-1">
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
                                            index === popGenreBooks.length - 1 &&
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
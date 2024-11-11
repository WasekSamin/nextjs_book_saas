import { RichTextElement } from "@/utils/RichTextElement";
import Image from "next/image"
import Link from "next/link";
import { FaHeart, FaLongArrowAltRight, FaRegHeart, FaRegStar, FaStar } from "react-icons/fa";
import { IoBookOutline, IoCartOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import { useBookStore } from "@/store/BookStore";
import { ImSpinner, ImSpinner9 } from "react-icons/im";
import { pb } from "@/store/PocketbaseStore";
import { updateBookFavouriteMode } from "@/utils/favouriteBookFunc";
import { RecordModel } from "pocketbase";
import { AnimatePresence } from "framer-motion";
import PurchaseBookModal from "./PurchaseBookModal";
import { useRef } from "react";

const BookDetails = () => {
    // Book store
    const isBookDetailsFetching = useBookStore((state: any) => state.isBookDetailsFetching);
    const book = useBookStore((state: any) => state.bookDetails);
    const isFavouriteBookSubmitting = useBookStore((state: any) => state.isFavouriteBookSubmitting);
    const updateIsFavouriteBookSubmitting = useBookStore((state: any) => state.updateIsFavouriteBookSubmitting);
    const emptyFavouriteBooks = useBookStore((state: any) => state.emptyFavouriteBooks);
    const purchasedBookDetails = useBookStore((state: any) => state.purchasedBookDetails);
    const showPurchasedBookModal = useBookStore((state: any) => state.showPurchasedBookModal);
    const updateShowPurchasedBookModal = useBookStore((state: any) => state.updateShowPurchasedBookModal);

    const controllerRef = useRef<AbortController>();

    const handleFavouriteBook = async ({ book, isFav }: { book: RecordModel, isFav: boolean }) => {
        updateIsFavouriteBookSubmitting(true);

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        await updateBookFavouriteMode({
            book: book,
            isFav: isFav,
            signal: signal
        });

        updateIsFavouriteBookSubmitting(false);
        emptyFavouriteBooks();
    }

    const downloadOrReadBook = ({ book, isDownload }: { book: RecordModel, isDownload: boolean }) => {
        const bookUrlElem = document.createElement("a");
        bookUrlElem.href = pb.files.getUrl(book, book.attachment);
        bookUrlElem.target = "_blank";
        bookUrlElem.classList.add("hidden");

        if (isDownload) {
            bookUrlElem.download = book.attachment;
        }

        document.body.append(bookUrlElem);
        bookUrlElem.click();

        document.body.removeChild(bookUrlElem);
    }


    return (
        <>
            <AnimatePresence mode='wait' initial={false}>
                {
                    showPurchasedBookModal &&
                    <PurchaseBookModal />
                }
            </AnimatePresence>

            <div className="flex flex-col gap-y-5">
                {
                    isBookDetailsFetching ?
                        <div className="w-full flex items-center justify-center">
                            <ImSpinner className="page__spinner" />
                        </div> :
                        book ?
                            <>
                                <div className="p-5 rounded-md border border-theme">
                                    <div className="flex flex-col lg:flex-row gap-5">
                                        <div className="translate-y-[-25%]">
                                            <Image src={pb.files.getUrl(book, book.thumbnail, { 'thumb': '180x260' })} width={180} height={260} className='min-w-full w-full lg:w-[180px] lg:min-w-[180px] h-[260px] min-h-[260px] object-contain lg:object-cover' alt={`${book.title} Image`} />
                                        </div>
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

                                            <div className="w-full flex flex-col gap-y-5 order-1 lg:order-2">
                                                <p className="w-fit text-base md:text-lg font-semibold">{book.title}</p>
                                                <div className="flex flex-col gap-y-3">
                                                    {
                                                        book.authors?.length &&
                                                        <div className="flex flex-wrap gap-0.5">
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
                                                </div>

                                                {
                                                    book.purchase_type === "paid" &&
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p>Price: </p>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h5 className={`${book.discount_price ? "line-through" : "font-semibold"}`}>BDT {book.price}</h5>
                                                            {
                                                                book.discount_price &&
                                                                <>
                                                                    <FaLongArrowAltRight />
                                                                    <h5 className="font-semibold">BDT {book.discount_price}</h5>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                }

                                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                                    {
                                                        (book.purchase_type === "free" || purchasedBookDetails) ?
                                                            <>
                                                                <button onClick={() => downloadOrReadBook({ book: book, isDownload: true })} className="w-full sm:w-fit flex items-center justify-center gap-x-1.5 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-light rounded-full transition-colors duration-200 ease-linear">
                                                                    <LuDownload className="text-lg" />
                                                                    Download
                                                                </button>
                                                                <Link onClick={() => downloadOrReadBook({ book: book, isDownload: false })} href="/" target="_blank" className="w-full sm:w-fit flex items-center justify-center gap-x-1.5 px-5 py-2 bg-teal-500 hover:bg-teal-600 text-light rounded-full transition-colors duration-200 ease-linear">
                                                                    <IoBookOutline className="text-lg" />
                                                                    Read Online
                                                                </Link>
                                                            </>
                                                            :
                                                            <button onClick={() => updateShowPurchasedBookModal(true)} className="w-full sm:w-fit flex items-center justify-center gap-x-1.5 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-light rounded-full transition-colors duration-200 ease-linear">
                                                                {
                                                                    showPurchasedBookModal ?
                                                                        <ImSpinner9 className="my-0.5 content__spinner" />
                                                                        : <>
                                                                            <IoCartOutline className="text-lg" />
                                                                            Pay <span className="font-semibold">BDT {book.discount_price ?? book.price}</span>
                                                                        </>
                                                                }
                                                            </button>
                                                    }
                                                </div>

                                                {
                                                    book.total_pages &&
                                                    <p>{book.total_pages} page{book.total_pages > 1 ? "s" : ""}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-5 mt-5">
                                    <h5 className="text-xl md:text-2xl font-semibold">Description</h5>
                                    <div className='custom__list'>
                                        <RichTextElement content={book.description} />
                                    </div>
                                </div>
                            </> :
                            <p>Book not found!</p>
                }
            </div>
        </>
    )
}

export default BookDetails
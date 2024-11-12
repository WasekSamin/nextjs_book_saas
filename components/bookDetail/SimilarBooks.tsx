import { fetchBooks, useBookStore } from "@/store/BookStore"
import pb from "@/store/PocketbaseStore"
import { isFavouriteBook, updateBookFavouriteMode } from "@/utils/favouriteBookFunc"
import { RichTextElement } from "@/utils/RichTextElement"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { RecordModel } from "pocketbase"
import { useEffect, useRef } from "react"
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from "react-icons/fa"
import { ImSpinner } from "react-icons/im"
import { Tooltip } from "react-tooltip"

const SimilarBooks = () => {
    const { id: bookId } = useParams();

    // Book store
    const bookDetails = useBookStore((state: any) => state.bookDetails);
    const isSimilarBookFetching = useBookStore((state: any) => state.isSimilarBookFetching);
    const updateIsSimilarBookFetching = useBookStore((state: any) => state.updateIsSimilarBookFetching);
    const similarBooks = useBookStore((state: any) => state.similarBooks);
    const addSimilarBooks = useBookStore((state: any) => state.addSimilarBooks);
    const isFavouriteBookSubmitting = useBookStore((state: any) => state.isFavouriteBookSubmitting);
    const updateIsFavouriteBookSubmitting = useBookStore((state: any) => state.updateIsFavouriteBookSubmitting);
    const emptyFavouriteBooks = useBookStore((state: any) => state.emptyFavouriteBooks);

    const getSimilarBooks = async (page: number) => {
        updateIsSimilarBookFetching(true);

        if (bookDetails.genres) {
            let genreBookIds = new Set();

            for (let i = 0; i < bookDetails.genres.length; i++) {
                const genre: RecordModel = bookDetails.genres[i];

                const { items: books }: any = await fetchBooks({ page: page, genreId: genre.id });

                if (books) {
                    for (let j = 0; j < books.length; j++) {
                        const book = books[j];

                        if (book.id === bookDetails.id) continue;

                        if (!genreBookIds.has(book.id)) {
                            genreBookIds.add(book.id);

                            if (pb?.authStore?.model) {
                                const isFav: boolean = await isFavouriteBook({ bookId: book.id });
                                book.is_favourite = isFav;
                            }

                            const { authors }: any = book?.expand;

                            if (authors) {
                                book.authors = authors;
                            }

                            addSimilarBooks(book);
                        }
                    }
                }
            }
        }

        updateIsSimilarBookFetching(false);
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
        if (bookDetails && bookId === bookDetails.id) {
            getSimilarBooks(1);
        }
    }, [bookId, bookDetails])

    return (
        <div className='flex flex-col gap-y-5 border-b border-theme pb-10'>
            <h5 className='font-semibold text-xl md:text-2xl'>Similar Books</h5>

            <div className={`${similarBooks?.length > 0 ? "mt-20" : ""}`}>
                {
                    isSimilarBookFetching || !bookDetails ?
                        <div className="w-full flex items-center justify-center">
                            <ImSpinner className="page__spinner" />
                        </div> :
                        similarBooks?.length > 0 ?
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-20">
                                {
                                    similarBooks?.map((book: RecordModel) => (
                                        book.id !== bookDetails.id &&
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
                                                            <Tooltip id={`fav__book-${book.id}`} className="custom__tooltip" />
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
                                        </div>
                                    ))
                                }
                            </div> : <p>No similar books found yet!</p>

                }
            </div>
        </div>
    )
}

export default SimilarBooks
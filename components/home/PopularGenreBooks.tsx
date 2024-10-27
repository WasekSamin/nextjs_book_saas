import { BOOKS } from "@/data"
import { useBookStore } from "@/store/BookStore";
import { pb } from "@/store/PocketbaseStore";
import { useThemeStore } from "@/store/ThemeStore";
import { RichTextElement } from "@/utils/RichTextElement";
import { makeToast } from "@/utils/toastMesage";
import Image from "next/image"
import Link from "next/link";
import { useEffect } from "react";
import { FaRegHeart, FaRegStar, FaStar } from "react-icons/fa"
import { Tooltip } from 'react-tooltip';

const PAGINATION_LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT);

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

    const fetchBooks = async(page: number) => {
        try {
            const bookList = await pb.collection('books').getList(page, PAGINATION_LIMIT, {
                sort: "-created",
            });

            console.log(bookList)
        } catch(err) {
            console.log(err);
            makeToast({
                toastType: "error",
                msg: "Failed to fetch popular genre books!",
                isDark: isDarkMode
            });
            updateReRenderPopGenreBooks(true);
        }
    }

    useEffect(() => {
        if (reRenderPopGenreBooks) {
            fetchBooks(popGenreBookPage);
        }
    }, [])

    return (
        <div className="mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-20">
                {
                    BOOKS?.map(book => (
                        <div key={book.id} className="p-5 rounded-md border border-theme">
                            <div className="flex flex-col lg:flex-row gap-5">
                                <Link href={`book/${book.id}`} className="translate-y-[-25%]">
                                    <Image src={book.image} width={180} height={260} className='min-w-full w-full lg:w-[180px] lg:min-w-[180px] h-[260px] min-h-[260px] object-contain lg:object-cover' alt={`${book.title} Image`} />
                                </Link>
                                <div className="w-full flex flex-row lg:flex-col lg:items-start justify-between lg:justify-start gap-y-5 translate-y-[-40%] lg:translate-y-0">
                                    <div className="lg:w-full flex justify-end order-2 lg:order-1">
                                        <FaRegHeart data-tooltip-id={`fav__book-${book.id}`} data-tooltip-content="Add to favorite" className="text-danger text-lg cursor-pointer" />
                                        <Tooltip id={`fav__book-${book.id}`} className="custom__tooltip" />
                                    </div>

                                    <div className="flex flex-col gap-y-5 order-1 lg:order-2">
                                        <Link href={`/book/${book.id}`} className="w-fit text-base md:text-lg font-semibold">{book.title}</Link>
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
                    ))
                }
            </div>
        </div>
    )
}

export default PopularGenreBooks
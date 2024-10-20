import { BOOKS } from "@/data"
import { RichTextElement } from "@/utils/RichTextElement";
import Image from "next/image"
import Link from "next/link";
import { FaRegHeart, FaRegStar, FaStar } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { Tooltip } from "react-tooltip";

const book = BOOKS[0];

const BookDetails = () => {
    return (
        <div className="flex flex-col gap-y-5">
            <div className="p-5 rounded-md border border-theme">
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="translate-y-[-25%]">
                        <Image src={book.image} width={180} height={260} className='min-w-full w-full lg:w-[180px] lg:min-w-[180px] h-[260px] min-h-[260px] object-contain lg:object-cover' alt={`${book.title} Image`} />
                    </div>
                    <div className="mt-10 lg:mt-0 w-full flex flex-row lg:flex-col lg:items-start justify-between lg:justify-start gap-y-5 translate-y-[-40%] lg:translate-y-0">
                        <div className="lg:w-full flex justify-end order-2 lg:order-1">
                            <FaRegHeart data-tooltip-id={`book__detail-${book.id}`} data-tooltip-content="Add to favorite" className="text-danger text-lg cursor-pointer" />
                            <Tooltip id={`book__detail-${book.id}`} className="custom__tooltip" />
                        </div>

                        <div className="w-full flex flex-col gap-y-5 order-1 lg:order-2">
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
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <button className="w-full sm:w-fit flex items-center justify-center gap-x-1.5 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-light rounded-full transition-colors duration-200 ease-linear">
                                    <LuDownload className="text-lg" />
                                    Download
                                </button>
                                <Link href="/" target="_blank" className="w-full sm:w-fit flex items-center justify-center gap-x-1.5 px-5 py-2 bg-teal-500 hover:bg-teal-600 text-light rounded-full transition-colors duration-200 ease-linear">
                                    <IoBookOutline className="text-lg" />
                                    Read Online
                                </Link>
                            </div>

                            <p>800 pages</p>
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
        </div>
    )
}

export default BookDetails
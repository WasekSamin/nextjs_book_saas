import Image from 'next/image';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Link from 'next/link';
import { RichTextElement } from '@/utils/RichTextElement';

import "@/css/home/Banner.css";
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import { fetchBooks, useBookStore } from '@/store/BookStore';
import { pb } from '@/store/PocketbaseStore';
import { ImSpinner } from 'react-icons/im';
import { RecordModel } from 'pocketbase';

const Banner = () => {
    const controllerRef = useRef<AbortController>();

    const bannerBooks = useBookStore((state: any) => state.bannerBooks);
    const addBannerBook = useBookStore((state: any) => state.addBannerBook);
    const reRenderBannerBooks = useBookStore((state: any) => state.reRenderBannerBooks);
    const updateReRenderBannerBooks = useBookStore((state: any) => state.updateReRenderBannerBooks);

    const fetchBannerBooks = async (page: number) => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;
        
        const {items: books}: any = await fetchBooks({page: page, signal: signal});

        if (books) {
            for (let i=0; i<books.length; i++) {
                const book: RecordModel = books[i];

                addBannerBook(book);
            }

            updateReRenderBannerBooks(false);
        }
    }

    useEffect(() => {
        if (reRenderBannerBooks) {
            fetchBannerBooks(1);
        }
    }, [])

    return (
        reRenderBannerBooks ?
            <div className="w-full flex items-center justify-center">
                <ImSpinner className="page__spinner" />
            </div> :
            <div className='banner__swipper'>
                <Swiper
                    modules={[Navigation, Scrollbar, A11y, Autoplay, Pagination, EffectCoverflow]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    loop={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{
                        clickable: true
                    }}
                    spaceBetween={50}
                    slidesPerView={1}
                    // onSlideChange={() => console.log('slide change')}
                    // onSwiper={(swiper) => console.log(swiper)}
                    breakpoints={{
                        1024: {
                            slidesPerView: 3
                        }
                    }}
                >
                    {
                        bannerBooks?.map((book: any) => (
                            <SwiperSlide key={book.id}>
                                <div className='flex flex-col min-[450px]:flex-row items-center gap-x-5 gap-y-5'>
                                    {
                                        book.thumbnail &&
                                        <Link href={`/book/${book.id}`}>
                                            <Image src={pb.files.getUrl(book, book.thumbnail, { 'thumb': '180x260' })} width={180} height={260} className='min-w-[180px] min-h-[260px] object-cover' alt={`${book.title} Image`} />
                                        </Link>
                                    }
                                    <div className='flex flex-col gap-y-3 items-center min-[450px]:items-start text-center min-[450px]:text-left'>
                                        <Link href={`/book/${book.id}`} className='font-semibold text-base md:text-lg three-line-text'>{book.title}</Link>
                                        <div className='custom__list three-line-text'>
                                            <RichTextElement content={book.description} />
                                        </div>
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
                                        <div className='mt-3 w-full min-[450px]:w-fit'>
                                            <Link href={`/book/${book.id}`} className='flex items-center justify-center whitespace-nowrap px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-light rounded-full transition-colors duration-200 ease-linear'>View Book</Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
    )
}

export default Banner
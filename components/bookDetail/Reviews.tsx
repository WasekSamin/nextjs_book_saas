import Image from "next/image"
import Avatar from "react-avatar"
import { FaRegStar, FaStar } from "react-icons/fa"
import dayjs from 'dayjs';
import { FiEdit } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { useEffect } from "react";
import { fetchBookReviews, useReviewStore } from "@/store/ReviewStore";
import { useBookStore } from "@/store/BookStore";
import { useInView } from "react-intersection-observer";
import { RecordModel } from "pocketbase";
import { pb } from "@/store/PocketbaseStore";
import { ImSpinner } from "react-icons/im";

const Reviews = () => {
    const { ref: bookReviewRef, inView: bookReviewInView, entry: bookReviewEntry } = useInView({
        /* Optional options */
        triggerOnce: true,
        threshold: 0,
    });

    // Review store
    const bookReviewPage = useReviewStore((state: any) => state.bookReviewPage);
    const updateBookReviewPage = useReviewStore((state: any) => state.updateBookReviewPage);
    const reRenderBookReview = useReviewStore((state: any) => state.reRenderBookReview);
    const updateReRenderBookReview = useReviewStore((state: any) => state.updateReRenderBookReview);
    const isBookReviewFetching = useReviewStore((state: any) => state.isBookReviewFetching);
    const updateIsBookReviewFetching = useReviewStore((state: any) => state.updateIsBookReviewFetching);
    const bookReviews = useReviewStore((state: any) => state.bookReviews);
    const addBookReview = useReviewStore((state: any) => state.addBookReview);
    const updateBookReviewDetails = useReviewStore((state: any) => state.updateBookReviewDetails);
    const bookReviewIds = useReviewStore((state: any) => state.bookReviewIds);

    // Book store
    const bookDetails = useBookStore((state: any) => state.bookDetails);


    const handleEditReview = (review: RecordModel) => {
        updateBookReviewDetails(review);

        document.body.querySelector("#review__form")?.scrollIntoView({
            behavior: "smooth"
        });
    }

    const getBookReviews = async (page: number) => {
        updateIsBookReviewFetching(true);
        const { items: bookReviews }: any = await fetchBookReviews({ page: page, bookId: bookDetails.id });

        if (bookReviews) {
            for (let i=0; i<bookReviews.length; i++) {
                const review: RecordModel = bookReviews[i];

                const { user }: any = review?.expand;

                if (user) {
                    review["user"] = user;
                    review["is_review_editable"] = user.id === pb?.authStore?.model?.id;
                }

                addBookReview(review);
            }
        }

        updateReRenderBookReview(false);
        updateIsBookReviewFetching(false);
    }

    const loadBookReviewInView = async () => {
        updateBookReviewPage(bookReviewPage + 1);
        await getBookReviews(bookReviewPage + 1);
    }

    useEffect(() => {
        if (reRenderBookReview && bookDetails) {
            getBookReviews(1);
        }
    }, [reRenderBookReview, bookDetails])

    useEffect(() => {
        bookReviewInView && loadBookReviewInView();
    }, [bookReviewInView])

    return (
        <div className="flex flex-col gap-y-5">
            {
                reRenderBookReview ?
                    <div className="w-full flex items-center justify-center">
                        <ImSpinner className="page__spinner" />
                    </div> :
                    bookReviews?.length > 0 ?
                        bookReviews.map((review: RecordModel, index: number) => (
                            <div key={review.id} className="flex items-center border-b border-theme pb-5 last:pb-0 last:border-b-0">
                                <div className="mr-5">
                                    {
                                        review.user?.avatar ?
                                            <Image src={pb.files.getUrl(review.user, review.user.avatar, { 'thumb': '35x35' })} width={35} height={35} className="min-w-[35px] min-h-[35px] object-cover rounded-full" alt={`${review.user.name} Image`} /> :
                                            <Avatar name={review.user.name} round={true} size="35px" />
                                    }
                                </div>

                                <div className="w-full flex gap-x-5 justify-between">
                                    <div className="flex flex-col gap-y-1.5">
                                        <h5 className="font-semibold">{review.user?.name}</h5>
                                        <p className="text-xs">{dayjs(!review.is_edited ? review.created : review.updated).format('DD/MM/YYYY hh:mm A')}</p>
                                        <div className='flex items-center gap-x-1 text-yellow-400 text-base'>
                                            {
                                                review.rating >= 1 ? <FaStar /> : <FaRegStar />
                                            }
                                            {
                                                review.rating >= 2 ? <FaStar /> : <FaRegStar />
                                            }
                                            {
                                                review.rating >= 3 ? <FaStar /> : <FaRegStar />
                                            }
                                            {
                                                review.rating >= 4 ? <FaStar /> : <FaRegStar />
                                            }
                                            {
                                                review.rating >= 5 ? <FaStar /> : <FaRegStar />
                                            }
                                        </div>

                                        <p className="mt-1.5">{review.review_message}</p>
                                    </div>

                                    {
                                        review.is_review_editable &&
                                        <div className="ml-5">
                                            <button onClick={() => handleEditReview(review)} data-tooltip-id={`review__comment-${review.id}`} data-tooltip-content="Edit Review" type="button" className="flex items-center justify-center text-base p-1.5 rounded-full hover:theme-block">
                                                <FiEdit />
                                                <Tooltip id={`review__comment-${review.id}`} className="custom__tooltip" />
                                            </button>
                                        </div>
                                    }
                                </div>
                                {
                                    index === bookReviews.length - 1 &&
                                    <div ref={bookReviewRef} className="invisible opacity-0 z-[-1]"></div>
                                }
                            </div>
                        )) : <p>No review yet!</p>
            }

            {
                isBookReviewFetching &&
                <div className="mt-5 w-full flex items-center justify-center">
                    <ImSpinner className="page__spinner" />
                </div>
            }
        </div>
    )
}

export default Reviews
import { REVIEWS } from "@/data"
import Image from "next/image"
import Avatar from "react-avatar"
import { FaRegStar, FaStar } from "react-icons/fa"
import dayjs from 'dayjs';
import { FiEdit } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const Reviews = () => {
    const handleEditReview = (reviewId: string) => {
        
    }

    return (
        <div className="flex flex-col gap-y-5">
            {
                REVIEWS?.map(review => (
                    <div key={review.id} className="flex items-center gap-x-5 border-b border-theme pb-5 last:pb-0 last:border-b-0">
                        <div>
                            {/* <Avatar name={review.user?.name} round={true} size="35px" /> */}
                            <Image src="/assets/images/no_img.jpg" width={35} height={35} className="min-w-[35px] min-h-[35px] object-cover rounded-full" alt={`${review.user.name} Image`} />
                        </div>

                        <div className="w-full flex gap-x-5 justify-between">
                            <div className="flex flex-col gap-y-1.5">
                                <h5 className="font-semibold">{review.user?.name}</h5>
                                <p className="text-xs">{dayjs().format('DD/MM/YYYY hh:mm A')}</p>
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

                            <div>
                                <button onClick={() => handleEditReview(review.id)} data-tooltip-id={`review__comment-${review.id}`} data-tooltip-content="Edit Review" type="button" className="flex items-center justify-center text-base p-1.5 rounded-full hover:theme-block">
                                    <FiEdit />
                                    <Tooltip id={`review__comment-${review.id}`} className="custom__tooltip" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Reviews
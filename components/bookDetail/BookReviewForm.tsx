import { useRef, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { MdOutlineRocketLaunch } from "react-icons/md";
import FormErrorElement from "../FormErrorElement";
import { ImSpinner9 } from "react-icons/im";
import FormSubmitButton from "../FormSubmitButton";

type RATING_ON_MOUSE_ACTION = {
    rating: number,
    hover: Boolean
}

const DEFAULT_BOOK_RATING_OPTIONS = {
    currentRating: 0,
    hoverRating: 0,
    prevRating: 0,
    showClearRating: false
}

type FORM_ERROR_TYPE = {
    errorId: number,
    errorMsg: string
}

type HANDLE_FORM_ERROR = {
    errId?: number,
    errMsg?: string | undefined,
    name?: string,
    isError?: boolean
}

const BookReviewForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookRating, setBookRating] = useState(DEFAULT_BOOK_RATING_OPTIONS);
    const [formError, setFormError] = useState<FORM_ERROR_TYPE>({
        errorId: -1,
        errorMsg: ""
    });

    const reviewFormRef = useRef<HTMLFormElement | null>(null);
    const reviewMessageRef = useRef<HTMLTextAreaElement | null>(null);

    const handleFormError = ({ errId, errMsg, name, isError }: HANDLE_FORM_ERROR) => {
        if (!name) {
            if (errId === 1 && errMsg) {
                setFormError({
                    errorId: errId,
                    errorMsg: errMsg
                });
            }
        } else {
            switch (name) {
                case "message":
                    if (reviewMessageRef.current) {
                        if (isError) {
                            reviewMessageRef.current.classList.remove("focus:ring-2", "focus:ring-indigo-400");
                            reviewMessageRef.current.classList.add("ring-2", "ring-rose-400");
                        } else {
                            reviewMessageRef.current.classList.remove("ring-2", "ring-rose-400");
                            reviewMessageRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                        }
                    }
                    break;
                default:
                    if (reviewMessageRef.current) {
                        reviewMessageRef.current.classList.remove("ring-2", "ring-rose-400");
                        reviewMessageRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                    }
            }
        }
    }

    // When a star is hovered/released
    const handleRatingMouseAction = ({ rating, hover }: RATING_ON_MOUSE_ACTION) => {
        if (hover) {
            // If hovered on star, then the current hovered and the stars situated on the left side will all get filled
            setBookRating(prevState => ({ ...prevState, hoverRating: rating, currentRating: 0 }));
        } else {
            // If mouse leave from star, then no star is hovered and the current selected rating should be set as previously set rating.
            setBookRating(prevState => ({ ...prevState, hoverRating: 0, currentRating: prevState.prevRating }));
        }
    }

    // When a rating is selected
    const handleBookRating = (rating: number) => {
        setBookRating(prevState => ({ ...prevState, hoverRating: 0, currentRating: rating, prevRating: rating, showClearRating: true }));
    }

    const handleClearRating = () => {
        setBookRating(DEFAULT_BOOK_RATING_OPTIONS);
    }

    const handleReviewSubmit = async (e: any) => {
        e.preventDefault();

        setIsSubmitting(true);

        // setFormError({
        //     errorId: -1,
        //     errorMsg: ""
        // });

        // const rating = bookRating.currentRating;
        // const reviewMessage = reviewMessageRef.current?.value?.trim();

        // if (rating < 1) {
        //     handleFormError({ errId: 1, errMsg: "Rating is required!" });
        //     return;
        // }
        // if (reviewMessage === "") {
        //     handleFormError({
        //         name: "message", isError: true
        //     });
        // }
    }

    const handleFormInputChange = (e: any) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value?.trim();

        if (fieldValue === "") {
            handleFormError({
                name: fieldName,
                isError: true
            });
        } else {
            handleFormError({
                name: fieldName,
                isError: false
            });
        }
    }

    return (
        <div>
            <form ref={reviewFormRef} onSubmit={handleReviewSubmit} className="flex flex-col gap-y-5 p-5 theme-block rounded-md">
                <div className="flex flex-col gap-y-1.5">
                    <label htmlFor="rating" className="font-medium">Rating</label>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className='flex items-center text-yellow-400 text-base'>
                            <div onClick={() => handleBookRating(1)} onMouseEnter={() => handleRatingMouseAction({ rating: 1, hover: true })} onMouseLeave={() => handleRatingMouseAction({ rating: 1, hover: false })} className="cursor-pointer pr-1 last:pr-0">
                                {
                                    bookRating.hoverRating >= 1 || bookRating.currentRating >= 1 ?
                                        <FaStar /> : <FaRegStar />
                                }
                            </div>
                            <div onClick={() => handleBookRating(2)} onMouseEnter={() => handleRatingMouseAction({ rating: 2, hover: true })} onMouseLeave={() => handleRatingMouseAction({ rating: 2, hover: false })} className="cursor-pointer pr-1 last:pr-0">
                                {
                                    bookRating.hoverRating >= 2 || bookRating.currentRating >= 2 ?
                                        <FaStar /> : <FaRegStar />
                                }
                            </div>
                            <div onClick={() => handleBookRating(3)} onMouseEnter={() => handleRatingMouseAction({ rating: 3, hover: true })} onMouseLeave={() => handleRatingMouseAction({ rating: 3, hover: false })} className="cursor-pointer pr-1 last:pr-0">
                                {
                                    bookRating.hoverRating >= 3 || bookRating.currentRating >= 3 ?
                                        <FaStar /> : <FaRegStar />
                                }
                            </div>
                            <div onClick={() => handleBookRating(4)} onMouseEnter={() => handleRatingMouseAction({ rating: 4, hover: true })} onMouseLeave={() => handleRatingMouseAction({ rating: 4, hover: false })} className="cursor-pointer pr-1 last:pr-0">
                                {
                                    bookRating.hoverRating >= 4 || bookRating.currentRating >= 4 ?
                                        <FaStar /> : <FaRegStar />
                                }
                            </div>
                            <div onClick={() => handleBookRating(5)} onMouseEnter={() => handleRatingMouseAction({ rating: 5, hover: true })} onMouseLeave={() => handleRatingMouseAction({ rating: 5, hover: false })} className="cursor-pointer pr-1 last:pr-0">
                                {
                                    bookRating.hoverRating >= 5 || bookRating.currentRating >= 5 ?
                                        <FaStar /> : <FaRegStar />
                                }
                            </div>
                        </div>

                        {
                            bookRating.showClearRating &&
                            <div>
                                <button onClick={handleClearRating} className="flex items-center text-danger justify-center gap-x-1">
                                    <IoCloseCircle />
                                    Clear Filter
                                </button>
                            </div>
                        }
                    </div>

                    {
                        (formError.errorId === 1 && formError.errorMsg) &&
                        <FormErrorElement errorMsg={formError.errorMsg} />
                    }
                </div>

                <textarea onChange={handleFormInputChange} rows={3} ref={reviewMessageRef} id="message" name="message" className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Your review"></textarea>

                <div>
                    <button disabled={isSubmitting} type="submit" className={`flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light ${isSubmitting ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"} transition-colors duration-200 ease-linear`}>
                        Comment
                        {
                            isSubmitting ?
                                <ImSpinner9 className="btn__spinner" /> :
                                <MdOutlineRocketLaunch />
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default BookReviewForm
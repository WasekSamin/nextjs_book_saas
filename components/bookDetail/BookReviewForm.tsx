import { useEffect, useRef, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { MdOutlineRocketLaunch } from "react-icons/md";
import FormErrorElement from "../FormErrorElement";
import { ImSpinner9 } from "react-icons/im";
import { HANDLE_FORM_ERROR } from "@/utils/formError";
import { useReviewStore } from "@/store/ReviewStore";
import { useBookStore } from "@/store/BookStore";
import pb from "@/store/PocketbaseStore";
import { makeToast } from "@/utils/toastMesage";
import { useThemeStore } from "@/store/ThemeStore";
import { TiCancel } from "react-icons/ti";

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

const BookReviewForm = () => {
    // Theme store
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);

    // Review store
    const isBookReviewSubmitting = useReviewStore((state: any) => state.isBookReviewSubmitting);
    const updateIsBookReviewSubmitting = useReviewStore((state: any) => state.updateIsBookReviewSubmitting);
    const addNewBookReview = useReviewStore((state: any) => state.addNewBookReview);
    const updateBookReview = useReviewStore((state: any) => state.updateBookReview);
    const bookReviewDetails = useReviewStore((state: any) => state.bookReviewDetails);
    const updateBookReviewDetails = useReviewStore((state: any) => state.updateBookReviewDetails);

    // Book store
    const bookDetails = useBookStore((state: any) => state.bookDetails);

    const [bookRating, setBookRating] = useState(DEFAULT_BOOK_RATING_OPTIONS);
    const [formError, setFormError] = useState<FORM_ERROR_TYPE>({
        errorId: -1,
        errorMsg: ""
    });

    const reviewFormRef = useRef<HTMLFormElement | null>(null);
    const reviewMessageRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (bookReviewDetails) {
            setFormError({
                errorId: -1,
                errorMsg: ""
            });

            setBookRating({
                currentRating: bookReviewDetails.rating,
                hoverRating: 0,
                prevRating: bookReviewDetails.rating,
                showClearRating: true
            });
            if (reviewMessageRef.current) {
                reviewMessageRef.current.value = bookReviewDetails.review_message;
            }
        }
    }, [bookReviewDetails])

    const handleFormError = ({ errId, errMsg, name, isError }: HANDLE_FORM_ERROR) => {
        if (!name) {
            if (errId === 1 && errMsg) {
                setFormError({
                    errorId: errId,
                    errorMsg: errMsg
                });
            } else if (errId === 2 && errMsg) {
                makeToast({
                    toastType: "error",
                    msg: errMsg,
                    isDark: isDarkMode
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

        updateIsBookReviewSubmitting(false);
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

        updateIsBookReviewSubmitting(true);

        setFormError({
            errorId: -1,
            errorMsg: ""
        });

        if (!bookDetails) {
            handleFormError({ errId: 2, errMsg: "Invalid book!" });
            return;
        }

        let formErrorExist = false;
        const rating = bookRating.currentRating;
        const reviewMessage = reviewMessageRef.current?.value?.trim() ?? "";

        if (rating < 1) {
            formErrorExist = true;
            handleFormError({ errId: 1, errMsg: "Rating is required!" });
        }
        if (reviewMessage === "") {
            formErrorExist = true;
            handleFormError({
                name: "message", isError: true
            });
        }

        if (formErrorExist) return;

        if (!bookReviewDetails) {
            await createBookReview({
                rating: rating,
                msg: reviewMessage
            });
        } else {
            await editBookReview({
                rating: rating,
                msg: reviewMessage
            });
        }
    }

    const editBookReview = async ({ rating, msg }: { rating: number, msg: string }) => {
        const formData = {
            rating: rating,
            review_message: msg,
            is_edited: true
        }

        try {
            const reviewRecord = await pb.collection('feedbacks').update(bookReviewDetails.id, formData, {
                expand: "user"
            });

            if (reviewRecord) {
                const { user }: any = reviewRecord?.expand;

                if (user) {
                    reviewRecord["user"] = user;
                    reviewRecord["is_review_editable"] = user.id === pb?.authStore?.model?.id;
                }
                updateBookReview(reviewRecord);

                makeToast({
                    toastType: "success",
                    msg: "Review updated successfully.",
                    isDark: isDarkMode
                });
            }

            updateIsBookReviewSubmitting(false);
            updateBookReviewDetails(null);

            resetBookReviewForm();
        } catch (err) {
            makeToast({
                toastType: "error",
                msg: "Failed to update the review!",
                isDark: isDarkMode
            });
            updateIsBookReviewSubmitting(false);
            updateBookReviewDetails(null);
        }
    }

    const createBookReview = async ({ rating, msg }: { rating: number, msg: string }) => {
        const formData = {
            rating: rating,
            review_message: msg,
            user: pb?.authStore?.model?.id,
            book: bookDetails.id
        }

        try {
            const reviewRecord = await pb.collection('feedbacks').create(formData, {
                expand: "user"
            });

            if (reviewRecord) {
                const { user: reviewRecordUser }: any = reviewRecord?.expand;

                if (reviewRecordUser) {
                    reviewRecord["user"] = reviewRecordUser;
                }
                reviewRecord["is_review_editable"] = true;
                addNewBookReview(reviewRecord);

                makeToast({
                    toastType: "success",
                    msg: "Review submitted successfully.",
                    isDark: isDarkMode
                });
                updateIsBookReviewSubmitting(false);

                resetBookReviewForm();
            }
        } catch (err) {
            makeToast({
                toastType: "error",
                msg: "Failed to submit the review!",
                isDark: isDarkMode
            });
            updateIsBookReviewSubmitting(false);
        }
    }

    const resetBookReviewForm = () => {
        reviewFormRef.current?.reset();
        setBookRating(DEFAULT_BOOK_RATING_OPTIONS);
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

    const cancelReviewUpdate = () => {
        setBookRating(DEFAULT_BOOK_RATING_OPTIONS);
        reviewFormRef.current?.reset();
        updateBookReviewDetails(null);
    }

    return (
        <div>
            <form ref={reviewFormRef} onSubmit={handleReviewSubmit} tabIndex={-1} id="review__form" className="flex flex-col gap-y-5 p-5 theme-block rounded-md">
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
                                    Clear Rating
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

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {
                        pb?.authStore?.model ?
                            <button disabled={isBookReviewSubmitting} type="submit" className={`w-full sm:w-fit flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light ${isBookReviewSubmitting ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"} transition-colors duration-200 ease-linear`}>
                                {
                                    bookReviewDetails ? "Update Comment" : "Comment"
                                }
                                {
                                    isBookReviewSubmitting ?
                                        <ImSpinner9 className="btn__spinner" /> :
                                        <MdOutlineRocketLaunch />
                                }
                            </button> : <p>You need to login to post a review!</p>
                    }
                    {
                        bookReviewDetails &&
                        <button onClick={cancelReviewUpdate} type="button" className={`w-full sm:w-fit flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light ${isBookReviewSubmitting ? "bg-rose-400" : "bg-rose-500 hover:bg-rose-600"} transition-colors duration-200 ease-linear`}>
                            Cancel
                            <TiCancel className="text-lg" />
                        </button>
                    }
                </div>
            </form>
        </div>
    )
}

export default BookReviewForm
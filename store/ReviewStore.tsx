import { RecordModel } from "pocketbase";
import { create } from "zustand";
import pb from "./PocketbaseStore";

const PAGINATION_LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT);

export const fetchBookReviews = async({page, bookId}: {page: number, bookId: string}) => {
    try {
        const reviewList = await pb.collection('feedbacks').getList(page, PAGINATION_LIMIT, {
            filter: `book.id="${bookId}" && is_hidden=${false}`,
            expand: "user",
            sort: "-created"
        });

        return reviewList;
    } catch(err) {
        return [];
    }
}


export const useReviewStore = create((set) => ({
    isBookReviewFetching: false,
    updateIsBookReviewFetching: (isFetching: boolean) => {
        set(() => ({
            isBookReviewFetching: isFetching
        }))
    },
    reRenderBookReview: true,
    updateReRenderBookReview: (isRender: boolean) => {
        set(() => ({
            reRenderBookReview: isRender
        }))
    },
    bookReviewPage: 1,
    updateBookReviewPage: (page: number) => {
        set(() => ({
            bookReviewPage: page
        }))
    },
    bookReviews: [],
    addBookReview: (review: RecordModel) => {
        set((state: any) => ({
            bookReviews: [...state.bookReviews, review]
        }))
    },
    // When new comment/review is submitted, just push it to the top
    addNewBookReview: (review: RecordModel) => {
        set((state: any) => ({
            bookReviews: [review, ...state.bookReviews]
        }))
    },
    updateBookReview: (review: RecordModel) => {
        set((state: any) => ({
            bookReviews: state.bookReviews.map((r: RecordModel) => r.id === review.id ? review : r)
        }))
    },
    emptyBookReview: () => {
        set(() => ({
            bookReviews: [],
            bookReviewPage: 1,
            reRenderBookReview: true
        }))
    },
    isBookReviewSubmitting: false,
    updateIsBookReviewSubmitting: (isSubmit: boolean) => {
        set(() => ({
            isBookReviewSubmitting: isSubmit
        }))
    },
    bookReviewDetails: null,
    updateBookReviewDetails: (review: RecordModel) => {
        set(() => ({
            bookReviewDetails: review
        }))
    },
    emptyBookReviewDetails: () => {
        set(() => ({
            bookReviewDetails: null
        }))
    }
}))
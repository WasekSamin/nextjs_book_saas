"use client";

import BookDetails from "@/components/bookDetail/BookDetails";
import Genre from "@/components/bookDetail/Genre";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/header/Navbar";
import { useParams } from "next/navigation";
import "@/css/book_detail/BookDetails.css";
import SimilarBooks from "@/components/bookDetail/SimilarBooks";
import BookReview from "@/components/bookDetail/BookReview";
import { useBookStore } from "@/store/BookStore";
import { useEffect } from "react";
import { useReviewStore } from "@/store/ReviewStore";

const BookDetail = () => {
    const {id: bookId} = useParams();

    // Book store
    const updateIsBookDetailsFetching = useBookStore((state: any) => state.updateIsBookDetailsFetching);
    const getBookDetails = useBookStore((state: any) => state.getBookDetails);
    const emptyBookDetails = useBookStore((state: any) => state.emptyBookDetails);

    // Review store
    const emptyBookReviewDetails = useReviewStore((state: any) => state.emptyBookReviewDetails);
    const emptyBookReview = useReviewStore((state: any) => state.emptyBookReview);

    const fetchBook = async() => {
        await getBookDetails(bookId);
        updateIsBookDetailsFetching(false);
    }

    useEffect(() => {
        if (bookId) {
            fetchBook();
        }

        return () => {
            emptyBookDetails();
            emptyBookReviewDetails();
            emptyBookReview();
        }
    }, [bookId])

    return (
        <>
            <Navbar />

            <div className="base-layout container mx-auto">
                <div className="flex flex-col gap-y-10">
                    <div id="book__detailGrid" className="mt-20 grid gap-x-10 border-b border-theme pb-10">
                        <BookDetails />
                        <Genre />
                    </div>
                    <SimilarBooks />
                    <BookReview />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default BookDetail;
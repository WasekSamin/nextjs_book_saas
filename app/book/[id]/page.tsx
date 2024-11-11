"use client";

import BookDetails from "@/components/bookDetail/BookDetails";
import Genre from "@/components/bookDetail/Genre";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/header/Navbar";
import { useParams } from "next/navigation";
import "@/css/book_detail/BookDetails.css";
import SimilarBooks from "@/components/bookDetail/SimilarBooks";
import BookReview from "@/components/bookDetail/BookReview";
import { fetchBookDetail, fetchPurchasedBook, useBookStore } from "@/store/BookStore";
import { useEffect, useRef } from "react";
import { useReviewStore } from "@/store/ReviewStore";
import { ImSpinner } from "react-icons/im";
import { usePageStore } from "@/store/PageStore";
import { makeToast } from "@/utils/toastMesage";
import { useThemeStore } from "@/store/ThemeStore";

const BookDetail = () => {
    const { id: bookId }: { id: string } = useParams();

    // Page store
    const isPageLoading = usePageStore((state: any) => state.isPageLoading);

    // Theme store
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);

    // Book store
    const updateBookDetails = useBookStore((state: any) => state.updateBookDetails);
    const updateIsBookDetailsFetching = useBookStore((state: any) => state.updateIsBookDetailsFetching);
    const emptyBookDetails = useBookStore((state: any) => state.emptyBookDetails);
    const updatePurchasedBookDetails = useBookStore((state: any) => state.updatePurchasedBookDetails);
    const emptyPurchasedBookDetails = useBookStore((state: any) => state.emptyPurchasedBookDetails);
    const emptySimilarBooks = useBookStore((state: any) => state.emptySimilarBooks);

    const purchasedBookControllerRef = useRef<AbortController>();
    const bookControllerRef = useRef<AbortController>();

    // Review store
    const emptyBookReviewDetails = useReviewStore((state: any) => state.emptyBookReviewDetails);
    const emptyBookReview = useReviewStore((state: any) => state.emptyBookReview);

    const getPurchasedBook = async () => {
        if (purchasedBookControllerRef.current) {
            purchasedBookControllerRef.current.abort();
        }

        purchasedBookControllerRef.current = new AbortController();
        const signal = purchasedBookControllerRef.current.signal;

        const purchasedBook = await fetchPurchasedBook({bookId: bookId, signal: signal});

        updatePurchasedBookDetails(purchasedBook);
    }

    const getBookDetails = async() => {
        if (bookControllerRef.current) {
            bookControllerRef.current.abort();
        }

        bookControllerRef.current = new AbortController();
        const signal = bookControllerRef.current.signal;

        const book = await fetchBookDetail({bookId, signal: signal});

        if (book) {
            updateBookDetails(book);
        } else {
            makeToast({
                toastType: "error",
                msg: "Failed to fetch book details!",
                isDark: isDarkMode
            });
        }
    }

    const fetchBook = async () => {
        await getBookDetails();
        await getPurchasedBook();
        updateIsBookDetailsFetching(false);
    }

    useEffect(() => {
        if (bookId) {
            fetchBook();
        }

        return () => {
            emptyBookDetails();
            emptySimilarBooks();
            emptyBookReviewDetails();
            emptyBookReview();
            emptyPurchasedBookDetails();
        }
    }, [bookId])

    return (
        isPageLoading ?
            <div className="w-full h-svh flex items-center justify-center">
                <ImSpinner className="page__spinner" />
            </div> :
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
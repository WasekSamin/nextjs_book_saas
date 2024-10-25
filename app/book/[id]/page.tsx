"use client";

import BookDetails from "@/components/bookDetail/BookDetails";
import Genre from "@/components/bookDetail/Genre";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/header/Navbar";
import { useParams } from "next/navigation";
import "@/css/book_detail/BookDetails.css";
import SimilarBooks from "@/components/bookDetail/SimilarBooks";
import BookReview from "@/components/bookDetail/BookReview";

const BookDetail = () => {
    const {id: bookId} = useParams();

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
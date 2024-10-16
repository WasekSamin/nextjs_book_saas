"use client";

import BookDetails from "@/components/bookDetail/BookDetails";
import Genre from "@/components/bookDetail/Genre";
import Footer from "@/components/Footer";
import Navbar from "@/components/header/Navbar";
import { useParams } from "next/navigation";
import "@/css/book_detail/BookDetails.css";

const BookDetail = () => {
    const {id: bookId} = useParams();

    return (
        <>
            <Navbar />

            <div className="base-layout container mx-auto">
                <div id="book__detailGrid" className="mt-20 grid gap-x-10">
                    <BookDetails />
                    <Genre />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default BookDetail;
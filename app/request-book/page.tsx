"use client";

import Footer from '@/components/Footer';
import Navbar from '@/components/header/Navbar';
import RequestBookExtraInfo from '@/components/requestBook/RequestBookExtraInfo';
import RequestBookForm from '@/components/requestBook/RequestBookForm';

const RequestBook = () => {
    return (
        <>
            <Navbar />

            <div className="base-layout container mx-auto">
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-5'>
                    <div className='border-b sm:border-r sm:border-b-0 border-theme pb-5 sm:pr-5 sm:pb-0'>
                        <RequestBookForm />
                    </div>

                    <RequestBookExtraInfo />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default RequestBook;
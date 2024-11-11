"use client";

import Footer from '@/components/footer/Footer';
import Navbar from '@/components/header/Navbar';
import RequestBookExtraInfo from '@/components/requestBook/RequestBookExtraInfo';
import RequestBookForm from '@/components/requestBook/RequestBookForm';
import { usePageStore } from '@/store/PageStore';
import { ImSpinner } from 'react-icons/im';

const RequestBook = () => {
    // Page store
    const isPageLoading = usePageStore((state: any) => state.isPageLoading);

    return (
        isPageLoading ?
            <div className="w-full h-svh flex items-center justify-center">
                <ImSpinner className="page__spinner" />
            </div> :
            <>
                <Navbar />

                <div className="base-layout container mx-auto">
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-5'>
                        <div className='border-b sm:border-r sm:border-b-0 border-theme pb-5 sm:pr-5 sm:pb-0'>
                            <RequestBookForm />
                        </div>

                        <RequestBookExtraInfo msg={"Simply send your book request to the whatsapp/email address."} />
                    </div>
                </div>

                <Footer />
            </>
    )
}

export default RequestBook;
"use client"

import Footer from '@/components/footer/Footer'
import Navbar from '@/components/header/Navbar'
import HelpRequestForm from '@/components/help/HelpRequestForm'
import RequestBookExtraInfo from '@/components/requestBook/RequestBookExtraInfo'
import React from 'react'

const HelpRequest = () => {
    return (
        <>
            <Navbar />

            <div className="base-layout container mx-auto">
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-5'>
                        <div className='border-b sm:border-r sm:border-b-0 border-theme pb-5 sm:pr-5 sm:pb-0'>
                            <HelpRequestForm />
                        </div>

                        <RequestBookExtraInfo msg={"Simply send a message via whatsapp/email."} />
                    </div>
                </div>

            <Footer />
        </>
    )
}

export default HelpRequest
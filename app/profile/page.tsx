"use client";

import Navbar from "@/components/header/Navbar"
import Footer from "@/components/footer/Footer"
import "@/css/profile/Profile.css";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfilePicUploadModal from "@/components/profile/ProfilePicUploadModal";
import { useUserStore } from "@/store/UserStore";
import { AnimatePresence } from "framer-motion";
import ProfileFavouriteBooks from "@/components/profile/ProfileFavouriteBooks";
import ProfileImage from "@/components/profile/ProfileImage";
import { useEffect } from "react";
import { usePageStore } from "@/store/PageStore";
import { ImSpinner } from "react-icons/im";

const Profile = () => {
    // Page store
    const isPageLoading = usePageStore((state: any) => state.isPageLoading);

    // User store
    const isUpdateProfilePic = useUserStore((state: any) => state.isUpdateProfilePic);
    const toggleIsUpdateProfilePic = useUserStore((state: any) => state.toggleIsUpdateProfilePic);
    const updateIsUserSubmitting = useUserStore((state: any) => state.updateIsUserSubmitting);

    useEffect(() => {
        return () => {
            updateIsUserSubmitting(false);
            toggleIsUpdateProfilePic(false);
        }
    }, [])

    return (
        isPageLoading ?
      <div className="w-full h-svh flex items-center justify-center">
        <ImSpinner className="page__spinner" />
      </div> : 
        <>
            <Navbar />

            <div className="base-layout container mx-auto">
                <div className="flex flex-col sm:flex-row gap-y-5 gap-x-10">
                    <ProfileImage />
                    <ProfileForm />
                </div>

                <ProfileFavouriteBooks />
            </div>

            <AnimatePresence>
                {
                    isUpdateProfilePic &&
                    <ProfilePicUploadModal />
                }
            </AnimatePresence>
            <Footer />
        </>
    )
}

export default Profile
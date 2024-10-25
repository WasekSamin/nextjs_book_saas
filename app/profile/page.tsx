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

const Profile = () => {
    const isUpdateProfilePic = useUserStore((state: any) => state.isUpdateProfilePic);

    return (
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
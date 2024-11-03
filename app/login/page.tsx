"use client";

import Footer from "@/components/footer/Footer"
import Navbar from "@/components/header/Navbar"
import { pb } from "@/store/PocketbaseStore";
import { convertUrlToFile } from "@/utils/urlToFile";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import { makeToast } from "@/utils/toastMesage";
import { useThemeStore } from "@/store/ThemeStore";
import { useEffect } from "react";
import { ImSpinner } from "react-icons/im";
import { usePageStore } from "@/store/PageStore";

const AUTHS = [
    {
        provider: "google",
        icon: <FcGoogle />
    },
    {
        provider: "github",
        icon: <FaGithub />
    }
]

const Login = () => {
    const router = useRouter();
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
    const isPageLoading = usePageStore((state: any) => state.isPageLoading);
    const updateIsPageLoading = usePageStore((state: any) => state.updateIsPageLoading);

    useEffect(() => {
        if (pb?.authStore?.model) {
            router.push("/");
        } else {
            updateIsPageLoading(false);
        }
    }, [])

    const handleAuth = async (providerName: string) => {
        switch (providerName) {
            case "google":
                const googleAuthData = await pb.collection('users').authWithOAuth2({ provider: 'google' });

                if (googleAuthData) {
                    updateUserInfo(googleAuthData);
                }

                break;
            case "github":
                const githubAuthData = await pb.collection('users').authWithOAuth2({ provider: 'github' });

                if (githubAuthData) {
                    updateUserInfo(githubAuthData);
                }
                break;
        }
    }

    const updateUserInfo = async (authData: any) => {
        const { avatar: userRecordAvatar, name: userRecordName }: { avatar: string, name: string } = authData.record;
        const { name, avatarUrl }: { name: string, avatarUrl: string } = authData.meta;
        const { id } = authData.record;

        let avatarFileObj: File | null | undefined = null;

        if (!userRecordAvatar && avatarUrl && typeof avatarUrl === "string") {
            avatarFileObj = await convertUrlToFile({ fileUrl: avatarUrl });
        }

        type FORM_DATA_TYPE = {
            name?: string, 
            avatar: File | null | undefined | string
        }

        let formData: FORM_DATA_TYPE = {
            name: name,
            avatar: avatarFileObj ? avatarFileObj : ""
        }

        if (userRecordName) {
            delete formData.name;
        }
        if (userRecordAvatar) {
            delete formData.avatar;
        }

        try {
            await pb.collection('users').update(id, formData);
            window.location.href = "/";
        } catch (err) {
            makeToast({
                toastType: "error",
                msg: "Failed to login! Please try again.",
                isDark: isDarkMode
            });
        }
    }

    return (
        isPageLoading ?
            <div className="w-full h-svh flex items-center justify-center">
                <ImSpinner className="page__spinner" />
            </div>
            :
            <>
                <Navbar />

                <div className="base-layout container mx-auto">
                    <div className="mt-5 mx-auto flex flex-col gap-y-5 theme-block rounded-md shadow-md p-5 max-w-[640px]">
                        <h5 className='font-semibold text-xl md:text-2xl'>Sign In</h5>
                        {
                            AUTHS?.map((auth, index) => (
                                <button key={index} onClick={() => handleAuth(auth.provider)} type="button" className="flex items-center justify-center gap-x-2 font-semibold text-lg border border-theme rounded-full px-5 py-2 transition-colors duration-200 ease-linear">
                                    {auth.icon} <span className="capitalize">{auth.provider}</span>
                                </button>
                            ))
                        }
                    </div>
                </div>

                <Footer />
            </>
    )
}

export default Login
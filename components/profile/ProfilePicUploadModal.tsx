import { useUserStore } from "@/store/UserStore"
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";

const _profilePicFileTypes = ["JPG", "PNG", "SVG"];

const ProfilePicUploadModal = () => {
    const [profilePicFile, setProfilePicFile] = useState<File | "">("");

    const profilePicModalRef = useRef<HTMLDivElement | null>(null);

    const isUpdateProfilePic = useUserStore((state: any) => state.isUpdateProfilePic);
    const toggleIsUpdateProfilePic = useUserStore((state: any) => state.toggleIsUpdateProfilePic);

    const updateProfilePicModalClickListener = (e: any) => {
        if (profilePicModalRef.current?.contains(e.target) ||
            e.target.closest("#preview__profilePicCloseBtn")
        ) return;

        toggleIsUpdateProfilePic(false);
    }

    useEffect(() => {
        if (isUpdateProfilePic) {
            document.addEventListener("click", updateProfilePicModalClickListener);
        }

        return () => {
            document.removeEventListener("click", updateProfilePicModalClickListener);
        }
    }, [isUpdateProfilePic])

    const handleProfilePicChange = (file: File | "") => {
        if (!file) {
            setProfilePicFile("");
            return;
        }

        setProfilePicFile(file);
    };

    const handleUpdateProfilePic = async() => {
        
    }

    return (
        <div className="fixed top-0 left-0 w-full h-svh z-[1003]">
            <div className="overlay"></div>
            <div className="absolute inset-0 absolute-layout container mx-auto w-full h-full flex flex-col items-center justify-center z-[1003]">
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0
                    }}
                    ref={profilePicModalRef}
                    className="w-full max-w-[600px] h-auto theme-block rounded-md p-5 shadow-md flex flex-col gap-y-5">
                    <div className="flex items-center justify-between gap-x-5 pb-3 border-b border-theme">
                        <h5 className="text-lg font-semibold">Upload Profile Pic</h5>

                        <div className="flex">
                            <button onClick={() => toggleIsUpdateProfilePic(false)} type="button" className="p-0.5 rounded-full rounded-close-btn text-danger">
                                <IoClose className="text-lg" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <div className="react__fileUploader">
                            <FileUploader handleChange={handleProfilePicChange} name="file" types={_profilePicFileTypes}
                                className="w-full"
                            />
                        </div>

                        <AnimatePresence initial={false} mode="wait">
                            {
                                profilePicFile &&
                                <div className="flex flex-col gap-y-5">
                                    <motion.div
                                        initial={{
                                            opacity: 0
                                        }}
                                        animate={{
                                            opacity: 1
                                        }}
                                        exit={{
                                            opacity: 0
                                        }}
                                        className="w-[80px] h-[80px] relative rounded-full shadow-md">
                                        <Image src={URL.createObjectURL(profilePicFile)} width={80} height={80} className="w-full h-full rounded-full object-cover" alt="Profile Pic Image" />
                                        <div className="absolute top-0 right-0">
                                            <button id="preview__profilePicCloseBtn" type="button" onClick={() => setProfilePicFile("")} className="p-0.5 rounded-full rounded-close-btn text-danger">
                                                <IoClose className="text-lg" />
                                            </button>
                                        </div>
                                    </motion.div>

                                    <button type='button' onClick={handleUpdateProfilePic} className='px-3 py-2 rounded-md flex items-center justify-center gap-x-1.5 bg-teal-500 hover:bg-teal-600 transition-colors duration-200 ease-linear'>
                                        <FiEdit />
                                        Update Pic
                                    </button>
                                </div>
                            }
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ProfilePicUploadModal
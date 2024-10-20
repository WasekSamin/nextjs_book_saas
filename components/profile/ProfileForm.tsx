"use client";

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion";
import { IoLockOpenOutline } from "react-icons/io5";
import { useUserStore } from "@/store/UserStore";
import { FiEdit } from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";

const ProfileForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isUpdatePassword = useUserStore((state: any) => state.isUpdatePassword);
    const toggleIsUpdatePassword = useUserStore((state: any) => state.toggleIsUpdatePassword);

    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

    const handleTogglePassword = () => {
        toggleIsUpdatePassword(!isUpdatePassword);

        if (!isUpdatePassword) {
            setTimeout(() => {
                passwordRef.current?.focus();
            }, 50);
        }
    }

    const handleProfileUpdate = async (e: any) => {
        e.preventDefault();

        setIsSubmitting(true);
    }

    return (
        <div className="w-full">
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-y-5 p-5 theme-block rounded-md">
                <h5 className='font-semibold text-xl md:text-2xl'>Profile</h5>

                <input autoFocus={true} ref={usernameRef} id="name" name="name" className="focus:outline-none px-3 py-2 rounded-md input__element placeholder: focus:ring-2 focus:ring-indigo-400" placeholder="Full Name" type="text" />
                <input id="email" name="email" className="focus:outline-none px-3 py-2 rounded-md input__element opacity-60 placeholder: focus:ring-2 focus:ring-indigo-400" placeholder="Email address" type="email" readOnly disabled />
                <div className="flex justify-end">
                    <button onClick={handleTogglePassword} type="button" className={`flex items-center justify-center gap-x-1.5 px-3 py-2 rounded-md ${isUpdatePassword ? "bg-rose-500 hover:bg-rose-600" : "bg-teal-500 hover:bg-teal-600"} transition-colors duration-200 ease-linear`}>
                        {
                            isUpdatePassword ?
                                <>
                                    <IoLockOpenOutline className="text-base" /> <span>Cancel Update</span>
                                </> :
                                <>
                                    <IoLockOpenOutline className="text-base" /> <span>Update Password</span>
                                </>
                        }
                    </button>
                </div>
                <AnimatePresence>
                    {
                        isUpdatePassword &&
                        <motion.div
                            initial={{
                                opacity: 0,
                                translateY: "-50px"
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0
                            }}
                            exit={{
                                opacity: 0,
                                translateY: "-50px"
                            }}
                            className="flex flex-col gap-y-3">
                            <input ref={passwordRef} id="password" name="password" className="focus:outline-none px-3 py-2 rounded-md input__element placeholder: focus:ring-2 focus:ring-indigo-400" placeholder="Password" type="password" />
                            <input ref={confirmPasswordRef} id="conf__password" name="conf__password" className="focus:outline-none px-3 py-2 rounded-md input__element placeholder: focus:ring-2 focus:ring-indigo-400" placeholder="Confirm Password" type="password" />
                        </motion.div>
                    }
                </AnimatePresence>

                <div className="mt-1">
                    <button disabled={isSubmitting} type="submit" className={`flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light ${isSubmitting ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"} transition-colors duration-200 ease-linear`}>
                        {
                            isSubmitting ?
                                <ImSpinner9 className="btn__spinner" /> :
                                <FiEdit />
                        }
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProfileForm
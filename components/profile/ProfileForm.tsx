"use client";

import { useRef } from "react"
import { useUserStore } from "@/store/UserStore";
import { FiEdit } from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";
import { pb } from "@/store/PocketbaseStore";
import { HANDLE_FORM_ERROR } from "@/utils/formError";
import { makeToast } from "@/utils/toastMesage";

const ProfileForm = () => {
    const isDarkMode = useUserStore((state: any) => state.isDarkMode);
    const isUserSubmitting = useUserStore((state: any) => state.isUserSubmitting);
    const updateIsUserSubmitting = useUserStore((state: any) => state.updateIsUserSubmitting);

    const nameRef = useRef<HTMLInputElement | null>(null);

    const controllerRef = useRef<AbortController>();

    const handleProfileUpdate = async (e: any) => {
        e.preventDefault();

        updateIsUserSubmitting(true);

        let isErrorExist = false;

        const name = nameRef.current?.value?.trim() ?? "";

        if (name === "") {
            isErrorExist = true;
            handleFormError({name: "name", isError: true});
        }

        if (isErrorExist) {
            updateIsUserSubmitting(false);
            return;
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        await editUser({
            name: name,
            signal: signal
        });
    }

    const editUser = async ({name, signal}: {name: string, signal: AbortSignal}) => {
        const formData = {
            name: name
        }

        try {
            const userRecord = await pb.collection('users').update(pb?.authStore?.model?.id, formData, {
                signal: signal
            });

            if (userRecord) {
                makeToast({
                    toastType: "success",
                    msg: "User profile updated successfully.",
                    isDark: isDarkMode
                });
                updateIsUserSubmitting(false);
            }
        } catch(err) {
            makeToast({
                toastType: "error",
                msg: "Failed to update the profile!",
                isDark: isDarkMode
            });
            updateIsUserSubmitting(false);
        }
    }

    const handleFormError = ({name, isError}: HANDLE_FORM_ERROR) => {
        switch (name) {
            case "name":
                if (nameRef.current) {
                    if (isError) {
                        nameRef.current.classList.remove("focus:ring-2", "focus:ring-indigo-400");
                        nameRef.current.classList.add("ring-2", "ring-rose-400");
                    } else {
                        nameRef.current.classList.remove("ring-2", "ring-rose-400");
                        nameRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                    }
                }
                break;
            default:
                if (nameRef.current) {
                    nameRef.current.classList.remove("ring-2", "ring-rose-400");
                    nameRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                }
        }
    }

    const handleFormInputChange = (e: any) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value.trim();

        if (fieldValue === "") {
            handleFormError({
                name: fieldName,
                isError: true
            });
        } else {
            handleFormError({
                name: fieldName,
                isError: false
            });
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-y-5 p-5 theme-block rounded-md">
                <h5 className='font-semibold text-xl md:text-2xl'>Profile</h5>

                <input autoFocus={true} defaultValue={pb?.authStore?.model?.name} ref={nameRef} id="name" name="name" onChange={handleFormInputChange} className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Full Name" type="text" />
                <input defaultValue={pb?.authStore?.model?.email} id="email" name="email" className="focus:outline-none px-3 py-2 rounded-md input__element opacity-60 focus:ring-2 focus:ring-indigo-400" placeholder="Email address" type="email" readOnly disabled />

                <div>
                    <button disabled={isUserSubmitting} type="submit" className={`flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light ${isUserSubmitting ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"} transition-colors duration-200 ease-linear`}>
                        {
                            isUserSubmitting ?
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
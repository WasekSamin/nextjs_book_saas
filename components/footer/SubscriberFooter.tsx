import pb from '@/store/PocketbaseStore';
import { useSubscriberStore } from '@/store/SubscriberStore';
import { useThemeStore } from '@/store/ThemeStore';
import { validateEmail } from '@/utils/emailValidation';
import { makeToast } from '@/utils/toastMesage';
import React, { useRef } from 'react'
import { ImSpinner9 } from 'react-icons/im';
import { MdOutlineRocketLaunch } from 'react-icons/md';

const SubscriberFooter = () => {
    // Theme store
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);

    // Subscriber store
    const isSubmitting = useSubscriberStore((state: any) => state.isSubmitting);
    const updateIsSubmitting = useSubscriberStore((state: any) => state.updateIsSubmitting);

    const emailRef = useRef<HTMLInputElement | null>(null);
    const subscriberFormRef = useRef<HTMLFormElement | null>(null);

    const handleFormError = ({ name, isError }: { name: string, isError: boolean }) => {
        switch (name) {
            case "email":
                if (subscriberFormRef.current) {
                    subscriberFormRef.current.classList.remove("ring-stone-700", "ring-indigo-200");

                    if (isError) {
                        subscriberFormRef.current.classList.remove("focus:ring-2", "focus:ring-indigo-400");
                        subscriberFormRef.current.classList.add("ring-2", "ring-rose-400");
                    } else {
                        subscriberFormRef.current.classList.remove("ring-2", "ring-rose-400");
                        subscriberFormRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                    }
                }
                break;
            default:
                if (subscriberFormRef.current) {
                    subscriberFormRef.current.classList.remove("ring-2", "ring-rose-400", "ring-indigo-200", "ring-stone-700");
                    subscriberFormRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                }
        }
    }

    const handleSubscriberSubmit = async (e: any) => {
        e.preventDefault();

        handleFormError({ name: "", isError: false });
        updateIsSubmitting(true);

        let isErrorExist: boolean = false;
        const email = emailRef.current?.value?.trim() ?? "";

        if (email === "") {
            handleFormError({ name: "email", isError: true });
            isErrorExist = true;
        }

        const isValidEmail = validateEmail(email);

        if (!isValidEmail) {
            handleFormError({ name: "email", isError: true });
            isErrorExist = true;
        }

        if (isErrorExist) {
            updateIsSubmitting(false);
            return;
        }

        await addSubscriber({
            email: email ?? ""
        });
    }

    const isSubscriberExist = async ({email}: {email: string}) => {
        try {
            const subRecord = await pb.collection('subscribers').getFirstListItem(`email="${email}"`);
            return subRecord ? true : false;
        } catch (err) {
            return false
        }
    }

    const addSubscriber = async ({
        email
    }: { email: string }) => {
        // Check if subscriber already exist
        const isSubbed = await isSubscriberExist({email: email});

        if (isSubbed) {
            makeToast({
                toastType: "error",
                msg: "Email is already subbed!",
                isDark: isDarkMode
            });
            updateIsSubmitting(false);
            handleFormError({ name: "email", isError: true });
            return;
        }

        const formData = {
            email: email
        }

        try {
            const subRecord = await pb.collection('subscribers').create(formData);

            if (subRecord) {
                makeToast({
                    toastType: "success",
                    msg: "You have subscribed successfully",
                    isDark: isDarkMode
                });
                resetSubscriberForm();
            }
            updateIsSubmitting(false);
        } catch (err) {
            makeToast({
                toastType: "error",
                msg: "Failed to subscribed!",
                isDark: isDarkMode
            });
            updateIsSubmitting(false);
        }
    }

    const resetSubscriberForm = () => {
        subscriberFormRef.current?.reset();
    }

    const emailOnFocus = () => {
        if (subscriberFormRef.current) {
            subscriberFormRef.current.classList.add("ring-2");
            if (isDarkMode) {
                subscriberFormRef.current.classList.add("ring-stone-700");
            } else {
                subscriberFormRef.current.classList.add("ring-indigo-200");
            }
        }
    }

    const emailOnBlur = () => {
        if (subscriberFormRef.current) {
            subscriberFormRef.current.classList.remove("ring-2");
            if (isDarkMode) {
                subscriberFormRef.current.classList.remove("ring-stone-700");
            } else {
                subscriberFormRef.current.classList.remove("ring-indigo-200");
            }
        }
    }

    const handleFormInputChange = (e: any) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value?.trim();

        if (fieldValue === "") {
            handleFormError({ name: fieldName, isError: true });
        } else {
            handleFormError({ name: fieldName, isError: false });
        }
    }

    return (
        <div className="w-full">
            <div className="flex flex-col gap-y-1.5">
                <div className="flex flex-col gap-y-5">
                    <h5 className="font-semibold text-xl md:text-3xl italic">Help Us to Grow</h5>
                    <form onSubmit={handleSubscriberSubmit} ref={subscriberFormRef} className="flex items-center gap-x-3 rounded-md py-1.5 px-3 border border-theme transition-all duration-200 ease-linear">
                        <input onFocus={emailOnFocus} onBlur={emailOnBlur} ref={emailRef} onChange={handleFormInputChange} name="email" type="email" className="w-full bg-transparent focus:outline-none" placeholder="Email Address..." />
                        <button disabled={isSubmitting} type="submit" >
                            {
                                isSubmitting ?
                                    <ImSpinner9 className="text-stone-500/80 btn__spinner" /> :
                                    <MdOutlineRocketLaunch className="text-xl text-stone-500/80 cursor-pointer" />
                            }
                        </button>
                    </form>
                </div>
                <p className="text-xs">Subscribe to us to get the latest update.</p>
            </div>
        </div>
    )
}

export default SubscriberFooter
import { useRef } from "react";
import { MdOutlineRocketLaunch } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { ImSpinner9 } from "react-icons/im";
import { pb } from "@/store/PocketbaseStore";
import { makeToast } from "@/utils/toastMesage";
import { useThemeStore } from "@/store/ThemeStore";
import { useHelpRequestStore } from "@/store/HelpRequestStore";
import { HANDLE_FORM_ERROR } from "@/utils/formError";

const HelpRequestForm = () => {
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
    const isSubmitting = useHelpRequestStore((state: any) => state.isSubmitting);
    const updateIsSubmitting = useHelpRequestStore((state: any) => state.updateIsSubmitting);

    const helpFormRef = useRef<HTMLFormElement | null>(null);
    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const messageRef = useRef<HTMLTextAreaElement | null>(null);

    const handleHelpRequestFormSubmit = async (e: any) => {
        e.preventDefault();

        updateIsSubmitting(true);
        handleFormError({ name: "", isError: false });

        let isErrorExist = false;

        const name = nameRef.current?.value?.trim() ?? "";
        const email = emailRef.current?.value?.trim() ?? "";
        const message = messageRef.current?.value?.trim() ?? "";

        if (name === "") {
            handleFormError({
                name: "name",
                isError: true
            });
            isErrorExist = true;
        }
        if (email === "") {
            handleFormError({
                name: "email",
                isError: true
            });
            isErrorExist = true;
        }
        if (message === "") {
            handleFormError({
                name: "message",
                isError: true
            });
            isErrorExist = true;
        }

        if (isErrorExist) {
            updateIsSubmitting(false);
            return;
        };

        await addHelpRequest({
            name: name,
            email: email,
            message: message,
        });
    }

    const addHelpRequest = async ({
        name, email, message
    }: { name: string, email: string, message: string }) => {
        const formData = {
            name: name,
            email: email,
            message: message,
            status: "not checked"
        }

        try {
            const helpRequestRecord = await pb.collection('help_requests').create(formData);

            if (helpRequestRecord) {
                makeToast({
                    toastType: "success",
                    msg: "Your request is submitted successfully.",
                    isDark: isDarkMode
                });

                resetHelpRequestForm();
                updateIsSubmitting(false);
            }
        } catch (err) {
            makeToast({
                toastType: "error",
                msg: "Failed to submit your request!",
                isDark: isDarkMode
            });
            updateIsSubmitting(false);
        }
    }

    const resetHelpRequestForm = () => {
        helpFormRef.current?.reset();
    }

    const handleFormError = ({ name, isError }: HANDLE_FORM_ERROR) => {
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
            case "email":
                if (emailRef.current) {
                    if (isError) {
                        emailRef.current.classList.remove("focus:ring-2", "focus:ring-indigo-400");
                        emailRef.current.classList.add("ring-2", "ring-rose-400");
                    } else {
                        emailRef.current.classList.remove("ring-2", "ring-rose-400");
                        emailRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                    }
                }
                break;
            case "message":
                if (messageRef.current) {
                    if (isError) {
                        messageRef.current.classList.remove("focus:ring-2", "focus:ring-indigo-400");
                        messageRef.current.classList.add("ring-2", "ring-rose-400");
                    } else {
                        messageRef.current.classList.remove("ring-2", "ring-rose-400");
                        messageRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                    }
                }
                break;
            default:
                if (nameRef.current) {
                    nameRef.current.classList.remove("ring-2", "ring-rose-400");
                    nameRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                }
                if (emailRef.current) {
                    emailRef.current.classList.remove("ring-2", "ring-rose-400");
                    emailRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                }
                if (messageRef.current) {
                    messageRef.current.classList.remove("ring-2", "ring-rose-400");
                    messageRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
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
        <form ref={helpFormRef} onSubmit={handleHelpRequestFormSubmit} className='flex flex-col gap-y-5 p-5 rounded-md theme-block'>
            <h5 className='font-semibold text-xl md:text-2xl'>How can we help you?</h5>

            <input autoFocus={true} ref={nameRef} name="name" id="name" onChange={handleFormInputChange} className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Your name" type="text" />
            <input ref={emailRef} name="email" id="email" onChange={handleFormInputChange} className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Your email address" type="email" />
            <textarea onChange={handleFormInputChange} rows={3} ref={messageRef} id="message" name="message" className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Your message"></textarea>

            <div>
                <button disabled={isSubmitting} type="submit" className={`flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light ${isSubmitting ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"} transition-colors duration-200 ease-linear`}>
                    Send
                    {
                        isSubmitting ?
                            <ImSpinner9 className="btn__spinner" /> :
                            <MdOutlineRocketLaunch />
                    }
                </button>
            </div>
        </form>
    )
}

export default HelpRequestForm
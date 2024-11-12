import { useBookStore } from "@/store/BookStore";
import pb from "@/store/PocketbaseStore";
import { useThemeStore } from "@/store/ThemeStore";
import { HANDLE_FORM_ERROR } from "@/utils/formError";
import { makeToast } from "@/utils/toastMesage";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ImSpinner9 } from "react-icons/im";
import { IoClose } from "react-icons/io5";
import { MdOutlineRocketLaunch } from "react-icons/md";
import emailjs from '@emailjs/browser';

const EMAIL_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAIL_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAIL_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAIL_FROM_NAME = process.env.NEXT_PUBLIC_EMAILJS_FROM_NAME;
const EMAIL_REPLY_TO = process.env.NEXT_PUBLIC_EMAILJS_REPLY_TO;
const DOMAIN_URL = process.env.NEXT_PUBLIC_BASE_URL;

const PurchaseBookModal = () => {
    // Theme store
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);

    // Book store
    const bookDetails = useBookStore((state: any) => state.bookDetails);
    const showPurchasedBookModal = useBookStore((state: any) => state.showPurchasedBookModal);
    const updateShowPurchasedBookModal = useBookStore((state: any) => state.updateShowPurchasedBookModal);
    const isPurchasedBookSubmitting = useBookStore((state: any) => state.isPurchasedBookSubmitting);
    const updateIsPurchasedBookSubmitting = useBookStore((state: any) => state.updateIsPurchasedBookSubmitting);

    const purchasedModalContentRef = useRef<HTMLDivElement | null>(null);
    const mobileNoRef = useRef<HTMLInputElement | null>(null);
    const trxIdRef = useRef<HTMLInputElement | null>(null);

    const handleFormError = ({ name, isError }: HANDLE_FORM_ERROR) => {
        switch (name) {
            case "mobile__no":
                if (mobileNoRef.current) {
                    if (isError) {
                        mobileNoRef.current.classList.remove("focus:ring-2", "focus:ring-indigo-400");
                        mobileNoRef.current.classList.add("ring-2", "ring-rose-400");
                    } else {
                        mobileNoRef.current.classList.remove("ring-2", "ring-rose-400");
                        mobileNoRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                    }
                }
                break;
            case "trx__id":
                    if (trxIdRef.current) {
                        if (isError) {
                            trxIdRef.current.classList.remove("focus:ring-2", "focus:ring-indigo-400");
                            trxIdRef.current.classList.add("ring-2", "ring-rose-400");
                        } else {
                            trxIdRef.current.classList.remove("ring-2", "ring-rose-400");
                            trxIdRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                        }
                    }
                    break;
            default:
                if (mobileNoRef.current) {
                    mobileNoRef.current.classList.remove("ring-2", "ring-rose-400");
                    mobileNoRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                }
                if (trxIdRef.current) {
                    trxIdRef.current.classList.remove("ring-2", "ring-rose-400");
                    trxIdRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
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
            if (fieldName === "mobile__no") {
                if (isNaN(fieldValue)) {
                    handleFormError({
                        name: fieldName,
                        isError: true
                    });
                    return;
                }
            }

            handleFormError({
                name: fieldName,
                isError: false
            });
        }
    }

    const handlePaymentFormSubmit = async(e: any) => {
        e.preventDefault();

        updateIsPurchasedBookSubmitting(true);

        const mobileNo = mobileNoRef.current?.value?.trim() ?? "";
        const trxId = trxIdRef.current?.value?.trim() ?? "";

        let isErrorExist = false;

        // @ts-ignore
        if (mobileNo === "" || isNaN(mobileNo)) {
            handleFormError({
                name: "mobile__no",
                isError: true
            });
            isErrorExist = true;
        }
        if (trxId === "") {
            handleFormError({
                name: "trx__id",
                isError: true
            });
            isErrorExist = true;
        }

        if (isErrorExist) {
            updateIsPurchasedBookSubmitting(false);
            return;
        }

        await createPurchaseBookRequest({
            mobileNo: mobileNo,
            trxId: trxId
        });
    }

    const createPurchaseBookRequest = async({mobileNo, trxId}: {
        mobileNo: string,
        trxId: string
    }) => {
        const formData = {
            user: pb?.authStore?.model?.id,
            book: bookDetails.id,
            purchased_amount: bookDetails.discount_price ?? bookDetails.price,
            mobile_no: mobileNo,
            trx_id: trxId
        }

        try {
            const purchasedRecord = await pb.collection('checkouts').create(formData, {
                expand: "book",
                requestKey: null
            });

            if (purchasedRecord) {
                makeToast({
                    toastType: "success",
                    msg: "Purchase request submitted successfully.",
                    isDark: isDarkMode
                });
                makeToast({
                    toastType: "info",
                    msg: "The book will be sent to your email in 2-10 minutes.",
                    isDark: isDarkMode,
                    autoClose: 15000
                });

                const firstName = pb?.authStore?.model?.name?.split(" ")?.[0] ?? "";
                const lastName = pb?.authStore?.model?.name?.split(" ")?.[1] ?? "";

                const emailData = {
                    first__name: firstName,
                    last__name: lastName,
                    email: pb?.authStore?.model?.email,
                    contact__no: mobileNo,
                    site__url: DOMAIN_URL,
                    message: `${pb?.authStore?.model?.name} (${pb?.authStore?.model?.id}) sent a purchased book request of "${bookDetails.title} (${bookDetails.id})". 
                                Purchase ID: "${purchasedRecord.id}"
                            `,
                    from_name: EMAIL_FROM_NAME,
                    reply_to: EMAIL_REPLY_TO
                }
    
                // @ts-ignore
                emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, emailData, {
                    publicKey: EMAIL_PUBLIC_KEY
                });

                updateIsPurchasedBookSubmitting(false);
                updateShowPurchasedBookModal(false);
            }
        } catch(err) {
            makeToast({
                toastType: "error",
                msg: "Failed to purchase the book!",
                isDark: isDarkMode
            });
            updateIsPurchasedBookSubmitting(false);
        }
    }

    return (
        <div className="fixed w-full h-svh top-0 left-0 z-[1003]">
            <div className="overlay"></div>
            <div className="absolute inset-0 absolute-layout container mx-auto w-full h-full flex flex-col items-center justify-center z-[1003]">
                <motion.div
                    initial={{
                        scale: 0,
                        opacity: 0
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1
                    }}
                    exit={{
                        scale: 0,
                        opacity: 0
                    }}
                    ref={purchasedModalContentRef}
                    className="w-full h-auto max-w-[640px] max-h-[80vh] theme-block p-5 rounded-md shadow-md"
                >
                    <div className="flex flex-col w-full h-full">
                        <div className="flex items-center justify-between gap-x-5 pb-3 border-b border-theme">
                            <h5 className="text-lg font-semibold">Pay with Bkash</h5>

                            <div className="flex">
                                <button onClick={() => updateShowPurchasedBookModal(false)} type="button" className="p-0.5 rounded-full rounded-close-btn text-danger">
                                    <IoClose className="text-lg" />
                                </button>
                            </div>
                        </div>

                        <div className="pt-3 flex flex-col gap-y-3">
                            <p>Pay BDT {bookDetails.discount_price ?? bookDetails.price} to this +8801688459216 phone number and submit your bkash mobile number and TrxID.</p>

                            <form onSubmit={handlePaymentFormSubmit} className="flex flex-col gap-y-3 w-full h-full">
                                <input autoFocus={true} ref={mobileNoRef} name="mobile__no" id="mobile__no" onChange={handleFormInputChange} className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Mobile no." type="text" />
                                <input ref={trxIdRef} name="trx__id" id="trx__id" onChange={handleFormInputChange} className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Bkash TrxID" type="text" />

                                <div>
                                    <button disabled={isPurchasedBookSubmitting} type="submit" className={`flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light ${isPurchasedBookSubmitting ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"} transition-colors duration-200 ease-linear`}>
                                        Send Request
                                        {
                                            isPurchasedBookSubmitting ?
                                                <ImSpinner9 className="btn__spinner" /> :
                                                <MdOutlineRocketLaunch />
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default PurchaseBookModal
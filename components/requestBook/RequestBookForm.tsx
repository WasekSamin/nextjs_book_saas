import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { MdOutlineRocketLaunch } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { ImSpinner9 } from "react-icons/im";
import { FileUploader } from "react-drag-drop-files";
import { pb } from "@/store/PocketbaseStore";
import { makeToast } from "@/utils/toastMesage";
import { useThemeStore } from "@/store/ThemeStore";
import { useBookStore } from "@/store/BookStore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { HANDLE_FORM_ERROR } from "@/utils/formError";

const REQUEST_BOOK_THUMBNAIL_FILE_TYPES = ["JPG", "PNG", "SVG"];

const RequestBookForm = () => {
    const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
    const isSubmittingBookRequest = useBookStore((state: any) => state.isSubmittingBookRequest);
    const updateIsSubmittingBookRequest = useBookStore((state: any) => state.updateIsSubmittingBookRequest);

    const [publishedDate, setPublishedDate] = useState<Date | null>(null);
    const [bookThumbnail, setBookThumbnail] = useState<File | "">("");

    const bookFormRef = useRef<HTMLFormElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const authorNameRef = useRef<HTMLInputElement | null>(null);
    const publishedDateRef = useRef<any>(null);

    const handleBookFormSubmit = async (e: any) => {
        e.preventDefault();

        updateIsSubmittingBookRequest(true);
        handleFormError({ name: "", isError: false });

        let isErrorExist = false;

        const title = titleRef.current?.value?.trim() ?? "";
        const authorName = authorNameRef.current?.value?.trim() ?? "";
        const bookPublishedDate = publishedDate ?? "";
        const bookThumbnailFile = bookThumbnail ?? "";

        if (title === "") {
            handleFormError({
                name: "title",
                isError: true
            });
            isErrorExist = true;
        }

        if (isErrorExist) {
            updateIsSubmittingBookRequest(false);
            return;
        };

        await addBookRequest({
            title: title,
            authorName: authorName,
            publishedDate: bookPublishedDate,
            bookThumbnail: bookThumbnailFile
        });
    }

    const addBookRequest = async ({
        title, authorName, publishedDate, bookThumbnail
    }: { title: string, authorName: string, publishedDate: Date | "", bookThumbnail: File | "" }) => {
        const formData = {
            user: pb?.authStore?.model?.id,
            book_title: title,
            author_name: authorName,
            published_date: publishedDate,
            book_thumbnail: bookThumbnail,
            status: "pending"
        }

        try {
            const bookRequestRecord = await pb.collection('requested_books').create(formData);

            if (bookRequestRecord) {
                makeToast({
                    toastType: "success",
                    msg: "Book request submitted successfully.",
                    isDark: isDarkMode
                });

                resetBookRequestForm();
                updateIsSubmittingBookRequest(false);
            }
        } catch (err) {
            makeToast({
                toastType: "error",
                msg: "Failed to submit the book request!",
                isDark: isDarkMode
            });
            updateIsSubmittingBookRequest(false);
        }
    }

    const resetBookRequestForm = () => {
        bookFormRef.current?.reset();
        setPublishedDate(null);
        setBookThumbnail("");
    }

    const handleBookThumbnailChange = (file: File | "") => {
        if (!file) {
            setBookThumbnail("");
            return;
        }

        setBookThumbnail(file);
    }

    const handleFormError = ({ name, isError }: HANDLE_FORM_ERROR) => {
        switch (name) {
            case "title":
                if (titleRef.current) {
                    if (isError) {
                        titleRef.current.classList.remove("focus:ring-2", "focus:ring-indigo-400");
                        titleRef.current.classList.add("ring-2", "ring-rose-400");
                    } else {
                        titleRef.current.classList.remove("ring-2", "ring-rose-400");
                        titleRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
                    }
                }
                break;
            default:
                if (titleRef.current) {
                    titleRef.current.classList.remove("ring-2", "ring-rose-400");
                    titleRef.current.classList.add("focus:ring-2", "focus:ring-indigo-400");
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
        <form ref={bookFormRef} onSubmit={handleBookFormSubmit} className='flex flex-col gap-y-5 p-5 rounded-md theme-block'>
            <h5 className='font-semibold text-xl md:text-2xl'>Request a Book</h5>

            <input autoFocus={true} ref={titleRef} name="title" id="title" onChange={handleFormInputChange} className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Book title" type="text" />
            <input id="author__name" ref={authorNameRef} name="author__name" className="focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400" placeholder="Author name" type="text" />
            <DatePicker
                ref={publishedDateRef}
                selected={publishedDate}
                onChange={(date: Date | null) => setPublishedDate(date)}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                className='w-full focus:outline-none px-3 py-2 rounded-md input__element focus:ring-2 focus:ring-indigo-400'
                placeholderText='Published date (dd/mm/yyyy)'
            />

            <div className="flex flex-col gap-y-3">
                <label htmlFor="">Book Thumbnail (Optional)</label>
                <div className="react__fileUploader">
                    <FileUploader handleChange={handleBookThumbnailChange} name="file" types={REQUEST_BOOK_THUMBNAIL_FILE_TYPES}
                        className="w-full"
                    />
                </div>
            </div>

            <AnimatePresence initial={false} mode="wait">
                {
                    bookThumbnail &&
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
                            className="w-[150px] h-[150px] relative rounded-full shadow-md">
                            <Image src={URL.createObjectURL(bookThumbnail)} width={150} height={150} className="w-full h-full rounded-md object-cover" alt="Book Thumbnail" />
                            <div className="absolute top-0 right-0">
                                <button id="preview__profilePicCloseBtn" type="button" onClick={() => setBookThumbnail("")} className="p-0.5 rounded-full rounded-close-btn text-danger">
                                    <IoClose className="text-lg" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                }
            </AnimatePresence>

            <div>
                <button disabled={isSubmittingBookRequest} type="submit" className={`flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light ${isSubmittingBookRequest ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"} transition-colors duration-200 ease-linear`}>
                    Send
                    {
                        isSubmittingBookRequest ?
                            <ImSpinner9 className="btn__spinner" /> :
                            <MdOutlineRocketLaunch />
                    }
                </button>
            </div>
        </form>
    )
}

export default RequestBookForm
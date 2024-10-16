import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { MdOutlineRocketLaunch } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";

const RequestBookForm = () => {
    const [publishedDate, setPublishedDate] = useState<Date | null>(null);

    const bookFormRef = useRef<HTMLFormElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const authorNameRef = useRef<HTMLInputElement | null>(null);
    const publishedDateRef = useRef<any>(null);

    const handleBookFormSubmit = async (e: any) => {
        e.preventDefault();
    }

    return (
        <form ref={bookFormRef} onSubmit={handleBookFormSubmit} className='flex flex-col gap-y-5 p-5 rounded-md theme-block'>
            <h5 className='font-semibold text-xl md:text-2xl'>Request a Book</h5>

            <input autoFocus={true} ref={titleRef} id="title" className="focus:outline-none px-3 py-2 rounded-md input__element placeholder: focus:ring-2 focus:ring-indigo-400" placeholder="Book title" type="text" name="title" />
            <input id="author__name" ref={authorNameRef} className="focus:outline-none px-3 py-2 rounded-md input__element placeholder: focus:ring-2 focus:ring-indigo-400" placeholder="Author name" type="text" name="author__name" />
            <DatePicker
                ref={publishedDateRef}
                selected={publishedDate}
                onChange={(date: Date | null) => setPublishedDate(date)}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                className='w-full focus:outline-none px-3 py-2 rounded-md input__element placeholder: focus:ring-2 focus:ring-indigo-400'
                placeholderText='Published date (dd/mm/yyyy)'
            />

            <div>
                <button type="submit" className='flex gap-x-1.5 items-center justify-center px-5 py-2 rounded-md text-light bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 ease-linear'>
                    Send
                    <MdOutlineRocketLaunch />
                </button>
            </div>
        </form>
    )
}

export default RequestBookForm
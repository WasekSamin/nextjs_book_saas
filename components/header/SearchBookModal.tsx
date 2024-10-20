import { BOOKS } from "@/data";
import { useNavStore } from "@/store/NavStore";
import { useThemeStore } from "@/store/ThemeStore";
import { RichTextElement } from "@/utils/RichTextElement";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoCloseCircleOutline, IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";

const SearchBookModal = () => {
  const isDarkMode = useThemeStore((state: any) => state.isDarkMode);
  const searchBookFormRef = useRef<HTMLFormElement | null>(null);
  const searchBookInputRef = useRef<HTMLInputElement | null>(null);
  const showBookSearchModal = useNavStore((state: any) => state.showBookSearchModal);
  const updateShowBookSearchModal = useNavStore((state: any) => state.updateShowBookSearchModal);

  const searchNavOnFocus = (e: any) => {
    searchBookFormRef.current?.classList.add("ring-2");
    if (isDarkMode) {
      searchBookFormRef.current?.classList.add("ring-stone-700");
    } else {
      searchBookFormRef.current?.classList.add("ring-indigo-200");
    }
  }

  const searchNavOnBlur = (e: any) => {
    searchBookFormRef.current?.classList.remove("ring-2");
    if (isDarkMode) {
      searchBookFormRef.current?.classList.remove("ring-stone-700");
    } else {
      searchBookFormRef.current?.classList.remove("ring-indigo-200");
    }
  }

  const handleSearchBook = async (e: any) => {
    e.preventDefault();

    const searchText = searchBookInputRef.current?.value?.trim();

  }

  const searchBookModalKeyUp = (e: any) => {
    console.log(e.key);
    if (e.key === "Escape") updateShowBookSearchModal(false);
  }

  useEffect(() => {
    console.log("BOOK SEARCH", showBookSearchModal);

    if (showBookSearchModal) {
      document.addEventListener("keyup", searchBookModalKeyUp);
    }

    return () => {
      console.log("CLOSING");
      showBookSearchModal && updateShowBookSearchModal(false);
      document.removeEventListener("keyup", searchBookModalKeyUp);
    }
  }, [])

  const handleCloseSearchBookModal = () => {
    updateShowBookSearchModal(false);
  }

  return (
    <motion.div
      initial={{
        top: "100%",
        opacity: 0
      }}
      animate={{
        top: 0,
        opacity: 1
      }}
      exit={{
        top: "100%",
        opacity: 0
      }}
      className="fixed top-0 left-0 w-full h-svh z-[1003] theme-block">
      <div className="h-full base-layout container mx-auto">
        <div className="h-full">
          <div className="h-full flex flex-col gap-y-5">
            <div className="flex justify-end">
              <button onClick={handleCloseSearchBookModal} type="button" className="flex items-center gap-x-1">
                <IoCloseCircleOutline />
                Close
              </button>
            </div>

            <form onSubmit={handleSearchBook} ref={searchBookFormRef} className="flex items-center gap-x-3 rounded-md py-1.5 px-3 border border-theme transition-all duration-200 ease-linear">
              <input ref={searchBookInputRef} onFocus={searchNavOnFocus} onBlur={searchNavOnBlur} type="text" className="w-full bg-transparent focus:outline-none" placeholder="Search books..." />
              <button type="submit" className="text-xl text-stone-500/80 cursor-pointer">
                <IoSearch />
              </button>
            </form>

            <div className="pt-5 h-full overflow-x-hidden overflow-y-auto flex flex-col gap-y-5">
              {
                BOOKS?.map(book => (
                  <div key={book.id} className="flex gap-x-5 pb-5 border-b border-theme last:pb-0 last:border-b-0">
                    <Link href={`/book/${book.id}`}>
                      <Image src="/assets/images/no_img.jpg" width={100} height={150} className="min-w-[100px] min-h-[150px] object-cover" alt={`${book.title} Image`} />
                    </Link>
                    <div className="flex flex-col gap-y-3">
                      <Link href={`/book/${book.id}`} className="w-fit text-base md:text-lg font-semibold">{book.title}</Link>
                      <div className="flex flex-col gap-y-3">
                        {
                          book.author &&
                          <Link href={`/author/${book.author.id}`} className="w-fit font-medium"><span className='font-normal'>By</span> {book.author.name}</Link>
                        }
                        <div className='flex items-center gap-x-1 text-yellow-400 text-base'>
                          {
                            book.rating >= 1 ? <FaStar /> : <FaRegStar />
                          }
                          {
                            book.rating >= 2 ? <FaStar /> : <FaRegStar />
                          }
                          {
                            book.rating >= 3 ? <FaStar /> : <FaRegStar />
                          }
                          {
                            book.rating >= 4 ? <FaStar /> : <FaRegStar />
                          }
                          {
                            book.rating >= 5 ? <FaStar /> : <FaRegStar />
                          }
                        </div>
                        <div className='custom__list three-line-text'>
                          <RichTextElement content={book.description} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SearchBookModal
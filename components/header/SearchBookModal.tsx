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
import { useDebouncedCallback } from 'use-debounce';
import { searchBooks, useBookStore } from "@/store/BookStore";
import { RecordModel } from "pocketbase";
import { pb } from "@/store/PocketbaseStore";
import { ImSpinner } from "react-icons/im";
import { useInView } from "react-intersection-observer";

const SearchBookModal = () => {
  // Theme store
  const isDarkMode = useThemeStore((state: any) => state.isDarkMode);

  // Nav store
  const showBookSearchModal = useNavStore((state: any) => state.showBookSearchModal);
  const updateShowBookSearchModal = useNavStore((state: any) => state.updateShowBookSearchModal);

  // Book store
  const searchBookText = useBookStore((state: any) => state.searchBookText);
  const updateSearchBookText = useBookStore((state: any) => state.updateSearchBookText);
  const searchedBooks = useBookStore((state: any) => state.searchedBooks);
  const addSearchedBooks = useBookStore((state: any) => state.addSearchedBooks);
  const isSearchedBooksFetching = useBookStore((state: any) => state.isSearchedBooksFetching);
  const updateIsSearchedBooksFetching = useBookStore((state: any) => state.updateIsSearchedBooksFetching);
  const emptySearchedBooks = useBookStore((state: any) => state.emptySearchedBooks);
  const searchedBookPage = useBookStore((state: any) => state.searchedBookPage);
  const updateSearchedBookPage = useBookStore((state: any) => state.updateSearchedBookPage);
  const isSearchedBookLoading = useBookStore((state: any) => state.isSearchedBookLoading);
  const updateIsSearchedBookLoading = useBookStore((state: any) => state.updateIsSearchedBookLoading);

  const { ref: searchedBookRef, inView: searchedBookInView, entry: searchedBookEntry } = useInView({
    /* Optional options */
    triggerOnce: true,
    threshold: 0,
  });

  const searchBookFormRef = useRef<HTMLFormElement | null>(null);
  const searchBookInputRef = useRef<HTMLInputElement | null>(null);

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

  const bookSearch = async (page: number) => {
    updateIsSearchedBooksFetching(true);

    const searchText = searchBookInputRef.current?.value?.trim() ?? "";
    updateSearchBookText(searchText);

    const { items: books }: any = await searchBooks({ page: page, searchText: searchText });

    if (books) {
      for (let i=0; i<books.length; i++) {
        const book: RecordModel = books[i];

        const { authors }: any = book?.expand;

        if (authors) {
          book.authors = authors;
        }

        addSearchedBooks(book);
      }
    }

    updateIsSearchedBooksFetching(false);
    updateSearchedBookPage(page);
  }

  const handleSearchBook = async (e: any) => {
    e.preventDefault();

    emptySearchedBooks();
    await bookSearch(1);
    updateIsSearchedBookLoading(false);
  }

  // Debounce callback
  const searchBookDebounce = useDebouncedCallback(
    // function
    async (value) => {
      emptySearchedBooks();
      await bookSearch(1);
      updateIsSearchedBookLoading(false);
    },
    // delay in ms
    1000
  );

  const searchBookModalKeyUp = (e: any) => {
    if (e.key === "Escape") handleCloseSearchBookModal();
  }

  useEffect(() => {
    if (showBookSearchModal) {
      document.addEventListener("keyup", searchBookModalKeyUp);
      document.body.classList.add("overflow-y-hidden");

      setTimeout(() => {
        searchBookInputRef.current?.focus();
      }, 50)
    }
  }, [])

  const handleCloseSearchBookModal = () => {
    updateShowBookSearchModal(false);
    document.removeEventListener("keyup", searchBookModalKeyUp);
    document.body.classList.remove("overflow-y-hidden");
  }

  const handleSearchBookText = (e: any) => {
    searchBookDebounce(e.target.value);
  }

  const loadSearchedBookInView = async () => {
    bookSearch(searchedBookPage + 1);
  }

  useEffect(() => {
    searchedBookInView && loadSearchedBookInView();
  }, [searchedBookInView])

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
              <button onClick={handleCloseSearchBookModal} type="button" className="flex items-center gap-x-1 text-danger">
                <IoCloseCircleOutline />
                Close
              </button>
            </div>

            <form onSubmit={handleSearchBook} ref={searchBookFormRef} className="flex items-center gap-x-3 rounded-md py-1.5 px-3 border border-theme transition-all duration-200 ease-linear">
              <input defaultValue={searchBookText} onChange={handleSearchBookText} ref={searchBookInputRef} onFocus={searchNavOnFocus} onBlur={searchNavOnBlur} type="text" className="w-full bg-transparent focus:outline-none" placeholder="Search books..." />
              <button type="submit" className="text-xl text-stone-500/80 cursor-pointer">
                <IoSearch />
              </button>
            </form>

            <div className="pt-5 h-full overflow-x-hidden overflow-y-auto flex flex-col gap-y-5">
              {
                isSearchedBookLoading ?
                  <div className="w-full flex items-center justify-center">
                    <ImSpinner className="page__spinner" />
                  </div> :
                  searchedBooks?.map((book: RecordModel, index: number) => (
                    <div key={book.id} className="flex gap-x-5 pb-5 border-b border-theme last:pb-0 last:border-b-0">
                      <Link onClick={handleCloseSearchBookModal} href={`/book/${book.id}`}>
                        <Image src={pb.files.getUrl(book, book.thumbnail, { 'thumb': '100x150' })} width={100} height={150} className="min-w-[100px] min-h-[150px] object-cover" alt={`${book.title} Image`} />
                      </Link>
                      <div className="flex flex-col gap-y-3">
                        <Link onClick={handleCloseSearchBookModal} href={`/book/${book.id}`} className="w-fit text-base md:text-lg font-semibold three-line-text">{book.title}</Link>
                        <div className="flex flex-col gap-y-3">
                          {
                            book.authors?.length &&
                            <div className="flex flex-wrap gap-0.5">
                              {
                                book.authors.map((author: RecordModel, index: number) => (
                                  <Link key={author.id} href={`/author/${author.id}`} className="w-fit font-medium">{author.name}{index !== book.authors.length - 1 && ","}</Link>
                                ))
                              }
                            </div>
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

                      {
                        index === searchedBooks.length - 1 &&
                        <div ref={searchedBookRef} className="invisible opacity-0 z-[-1]"></div>
                      }
                    </div>
                  ))
              }
            </div>

            {
              isSearchedBooksFetching &&
              <div className="mt-5 w-full flex items-center justify-center">
                <ImSpinner className="page__spinner" />
              </div>
            }
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SearchBookModal
import { RecordModel } from 'pocketbase';
import { create } from 'zustand'
import { pb } from './PocketbaseStore';

const PAGINATION_LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT);

const fetchBookDetail = async(bookId: string) => {
    return null;
}

export const fetchBooks = async(page: number) => {
    try {
        const bookList = await pb.collection('books').getList(page, PAGINATION_LIMIT, {
            sort: "-created",
        });

        return bookList;
    } catch(err) {
        return [];
    }
}

export const useBookStore = create((set) => ({
    // Single book details
    book: null,
    getBookDetails: async(bookId: string) => {
        const {data}: {data: object} = await fetchBookDetail(bookId);
    },

    // Book request submit
    isSubmittingBookRequest: false,
    updateIsSubmittingBookRequest: (isSubmit: boolean) => {
        set(() => ({
            isSubmittingBookRequest: isSubmit
        }))
    },

    // Popular genre books
    popGenreBookPage: 1,
    updatePopGenreBookPage: (page: number) => {
        set(() => ({
            popGenreBookPage: page
        }))
    },
    popGenreBookTotalPage: 1,
    updatePopGenreBookTotalPage: (totalPage: number) => {
        set(() => ({
            popGenreBookTotalPage: totalPage
        }))
    },
    reRenderPopGenreBooks: true,
    updateReRenderPopGenreBooks: (isRender: boolean) => {
        set(() => ({
            reRenderPopGenreBooks: isRender
        }))
    },
    popGenreBooks: [],
    fetchPopGenreBooks: () => {

    },
    addPopGenreBook: async (book: RecordModel) => {
        set((state: any) => ({
            popGenreBooks: [...state.popGenreBooks, book]
        }))
    },
    updatePopGenreBook: (bookId: string, bookNewData: any) => {
        set((state: any) => ({
            popGenreBooks: state.popGenreBooks?.map((book: RecordModel) => book.id === bookId ? {...bookNewData} : book)
        }))
    },
    // Loading icon for paginated book data fetching
    isPopGenreBookDataFetching: true,
    updateIsPopGenreBookDataFetching: (isFetching: boolean) => {
        set(() => ({
            isBookPopGenreDataFetching: isFetching
        }))
    },
    
    
    // Favourite book
    isFavouriteBookSubmitting: false,
    updateIsFavouriteBookSubmitting: (isSubmit: boolean) => {
        set(() => ({
            isFavouriteBookSubmitting: isSubmit
        }))
    },

    // Banner
    bannerBooks: [],
    addBannerBook: (book: RecordModel) => {
        set((state: any) => ({
            bannerBooks: [...state.bannerBooks, book]
        }))
    },
    emptyBannerBooks: () => {
        set(() => ({
            bannerBooks: []
        }))
    },
    reRenderBannerBooks: true,
    updateReRenderBannerBooks: (isRender: boolean) => {
        set(() => ({
            reRenderBannerBooks: isRender
        }))
    },
}));
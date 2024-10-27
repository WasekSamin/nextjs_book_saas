import { create } from 'zustand'

const fetchBookDetail = async(bookId: string) => {
    return null;
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
    reRenderPopGenreBooks: true,
    updateReRenderPopGenreBooks: (isRender: boolean) => {
        set(() => {
            reRenderPopGenreBooks: isRender
        })
    },
    popGenreBooks: [],
    addPopGenreBook: (book: object) => {
        set((state: any) => ({
            popGenreBooks: [...state.popGenreBooks, book]
        }))
    },
    // Loading icon for paginated book data fetching
    isPopGenreBookDataFetching: false,
    updateIsPopGenreBookDataFetching: (isFetching: boolean) => {
        set(() => ({
            isBookPopGenreDataFetching: isFetching
        }))
    },
    popGenreBookPage: 1,
    updatePopGenreBookPage: (page: number) => {
        set(() => ({
            popGenreBookPage: page
        }))
    },

    // Banner
    bannerBooks: [],
    addBannerBook: (book: object) => {
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
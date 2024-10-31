import { ListResult, RecordModel } from 'pocketbase';
import { create } from 'zustand'
import { pb } from './PocketbaseStore';

const PAGINATION_LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT);

const fetchBookDetail = async(bookId: string) => {
    return null;
}

export const fetchBooks = async({page, genreId}: {page: number, genreId?: string}) => {
    let bookList: ListResult<RecordModel>;

    try {
        if (!genreId) {
            bookList = await pb.collection('books').getList(page, PAGINATION_LIMIT, {
                sort: "-created",
                expand: "authors"
            });
        } else {
            bookList = await pb.collection('books').getList(page, PAGINATION_LIMIT, {
                filter: `genres~"${genreId}"`,
                expand: "authors",
                sort: "-created",
            });
        }

        return bookList;
    } catch(err) {
        return [];
    }
}

export const searchBooks = async({page, searchText}: {page: number, searchText: string}) => {
    if (searchText === "") {
        return [];
    }

    try {
        const bookList = await pb.collection('books').getList(page, PAGINATION_LIMIT, {
            filter: `id~"${searchText}" || title~"${searchText}"`,
            expand: "authors",
            sort: "-created"
        });

        return bookList;
    } catch(err) {
        return [];
    }
}

export const fetchFavouriteBooks = async({page}: {page: number}) => {
    try {
        const favBookList: ListResult<RecordModel> = await pb.collection('favourite_books').getList(page, PAGINATION_LIMIT, {
            filter: `user.id="${pb?.authStore?.model?.id}"`,
            expand: "book, book.authors",
            sort: "-created"
        });

        return favBookList;
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

    // Search books
    isSearchedBookLoading: false,
    updateIsSearchedBookLoading: (isSearching: boolean) => {
        set(() => ({
            isSearchedBookLoading: isSearching
        }))
    },
    isSearchedBooksFetching: false,
    updateIsSearchedBooksFetching: (isFetching: boolean) => {
        set(() => ({
            isSearchedBooksFetching: isFetching
        }))
    },
    searchedBookPage: 1,
    updateSearchedBookPage: (page: number) => {
        set(() => ({
            searchedBookPage: page
        }))
    },
    searchBookText: "",
    updateSearchBookText: (searchText: string) => {
        set(() => ({
            searchBookText: searchText
        }))
    },
    searchedBooks: [],
    addSearchedBooks: (book: RecordModel) => {
        set((state: any) => ({
            searchedBooks: [...state.searchedBooks, book]
        }))
    },
    emptySearchedBooks: () => {
        set(() => ({
            searchedBooks: [],
            searchedBookPage: 1,
        }))
    },

    // Popular genre books
    popGenreBookPage: 1,
    updatePopGenreBookPage: (page: number) => {
        set(() => ({
            popGenreBookPage: page
        }))
    },
    reRenderPopGenreBooks: true,
    updateReRenderPopGenreBooks: (isRender: boolean) => {
        set(() => ({
            reRenderPopGenreBooks: isRender
        }))
    },
    popGenreBooks: [],
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
    emptyPopGenreBooks: () => {
        set(() => ({
            popGenreBooks: [],
            reRenderPopGenreBooks: true,
            popGenreBookPage: 1
        }))
    },
    // Loading icon for paginated book data fetching
    isPopGenreBookDataFetching: true,
    updateIsPopGenreBookDataFetching: (isFetching: boolean) => {
        set(() => ({
            isPopGenreBookDataFetching: isFetching
        }))
    },
    
    // Favourite book
    reRenderFavouriteBooks: true,
    updateReRenderFavouriteBooks: (isRender: boolean) => {
        set(() => ({
            reRenderFavouriteBooks: isRender
        }))
    },
    favouriteBookPage: 1,
    updateFavouriteBookPage: (page: number) => {
        set(() => ({
            favouriteBookPage: page
        }))
    },
    isFavouriteBookDataFetching: true,
    updateIsFavouriteBookDataFetching: (isFetching: boolean) => {
        set(() => ({
            isFavouriteBookDataFetching: isFetching
        }))
    },
    isFavouriteBookSubmitting: false,
    updateIsFavouriteBookSubmitting: (isSubmit: boolean) => {
        set(() => ({
            isFavouriteBookSubmitting: isSubmit
        }))
    },
    favouriteBooks: [],
    addFavouriteBook: (book: RecordModel) => {
        set((state: any) => ({
            favouriteBooks: [...state.favouriteBooks, book]
        }))
    },
    removeFavouriteBook: (book: RecordModel) => {
        set((state: any) => ({
            favouriteBooks: state.favouriteBooks.filter((fb: RecordModel) => fb.id !== book.id)
        }))
    },
    emptyFavouriteBooks: () => {
        set(() => ({
            favouriteBooks: [],
            reRenderFavouriteBooks: true,
            favouriteBookPage: 1
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
import { ListResult, RecordModel } from 'pocketbase';
import { create } from 'zustand'
import pb from './PocketbaseStore';
import { isFavouriteBook } from '@/utils/favouriteBookFunc';

const PAGINATION_LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT);

export const fetchBookDetail = async ({ bookId }: { bookId: string }) => {
    try {
        const book = await pb.collection('books').getOne(bookId, {
            expand: 'authors, genres'
        });

        if (book) {
            if (pb?.authStore?.model) {
                const isFav: boolean = await isFavouriteBook({ bookId: book.id });
                book.is_favourite = isFav;
            }

            const { authors, genres }: any = book?.expand;

            if (authors) {
                book.authors = authors;
            }
            if (genres) {
                book.genres = genres;
            }
        }

        return book;
    } catch (err) {
        return null;
    }
}

export const fetchBooks = async ({ page, genreId, authorId }: { page: number, genreId?: string, authorId?: string }) => {
    let bookList: ListResult<RecordModel>;

    console.log(page, genreId, authorId)

    try {
        if (genreId) {
            bookList = await pb.collection('books').getList(page, PAGINATION_LIMIT, {
                filter: `genres~"${genreId}"`,
                expand: "authors",
                sort: "-created"
            });
        } else if (authorId) {
            bookList = await pb.collection('books').getList(page, PAGINATION_LIMIT, {
                filter: `authors~"${authorId}"`,
                expand: "authors",
                sort: "-created"
            });
        } else {
            bookList = await pb.collection('books').getList(page, PAGINATION_LIMIT, {
                sort: "-created",
                expand: "authors"
            });
        }

        return bookList;
    } catch (err) {
        return [];
    }
}

export const searchBooks = async ({ page, searchText }: { page: number, searchText: string }) => {
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
    } catch (err) {
        return [];
    }
}

export const fetchFavouriteBooks = async ({ page }: { page: number }) => {
    try {
        const favBookList: ListResult<RecordModel> = await pb.collection('favourite_books').getList(page, PAGINATION_LIMIT, {
            filter: `user.id="${pb?.authStore?.model?.id}"`,
            expand: "book, book.authors",
            sort: "-created"
        });

        return favBookList;
    } catch (err) {
        return [];
    }
}

export const fetchPurchasedBooks = async ({ page }: { page: number }) => {
    try {
        const purchasedBookList: ListResult<RecordModel> = await pb.collection("purchased_books").getList(page, PAGINATION_LIMIT, {
            filter: `user.id="${pb?.authStore?.model?.id}"`,
            expand: "book, book.authors",
            sort: "-created"
        })

        return purchasedBookList;
    } catch (err) {
        return [];
    }
}

export const fetchPurchasedBook = async ({ bookId }: { bookId: string }) => {
    try {
        const bookRecord: RecordModel = await pb.collection("purchased_books").getFirstListItem(`book.id="${bookId}" && user.id="${pb?.authStore?.model?.id}"`);
        return bookRecord;
    } catch (err) {
        return null;
    }
}

export const useBookStore = create((set) => ({
    // Single book details
    isBookDetailsFetching: true,
    updateIsBookDetailsFetching: (isFetching: boolean) => {
        set(() => ({
            isBookDetailsFetching: isFetching
        }))
    },
    bookDetails: null,
    updateBookDetails: (book: RecordModel) => {
        set(() => ({
            bookDetails: book
        }))
    },
    emptyBookDetails: () => {
        set(() => ({
            bookDetails: null,
            isBookDetailsFetching: true,
            bookGenres: [],
            similarBooks: []
        }))
    },

    // Similar books
    isSimilarBookFetching: true,
    updateIsSimilarBookFetching: (isSubmit: boolean) => {
        set(() => ({
            isSimilarBookFetching: isSubmit
        }))
    },
    similarBooks: [],
    addSimilarBooks: (book: RecordModel) => {
        set((state: any) => ({
            similarBooks: [...state.similarBooks, book]
        }))
    },
    emptySimilarBooks: () => {
        set(() => ({
            similarBooks: [],
            isSimilarBookFetching: true,
        }))
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
            popGenreBooks: state.popGenreBooks?.map((book: RecordModel) => book.id === bookId ? { ...bookNewData } : book)
        }))
    },
    emptyPopGenreBooks: () => {
        set(() => ({
            popGenreBooks: [],
            popGenreBookPage: 1,
            reRenderPopGenreBooks: true,
        }))
    },
    // Loading icon for paginated book data fetching
    isPopGenreBookDataFetching: true,
    updateIsPopGenreBookDataFetching: (isFetching: boolean) => {
        set(() => ({
            isPopGenreBookDataFetching: isFetching
        }))
    },

    // Genre wise books
    reRenderGenreBooks: true,
    updateReRenderGenreBooks: (isRender: boolean) => {
        set(() => ({
            reRenderGenreBooks: isRender
        }))
    },
    isGenreBookFetching: false,
    updateIsGenreBookFetching: (isFetching: boolean) => {
        set(() => ({
            isGenreBookFetching: isFetching
        }))
    },
    genreBookPage: 1,
    updateGenreBookPage: (page: number) => {
        set(() => ({
            genreBookPage: page
        }))
    },
    genreBooks: [],
    addGenreBooks: (book: RecordModel) => {
        set((state: any) => ({
            genreBooks: [...state.genreBooks, book]
        }))
    },
    emptyGenreBooks: () => {
        set(() => ({
            genreBooks: [],
            genreBookPage: 1,
            reRenderGenreBooks: true
        }))
    },

    // Author wise books
    authorBookPage: 1,
    updateAuthorBookPage: (page: number) => {
        set(() => ({
            authorBookPage: page
        }))
    },
    reRenderAuthorBooks: true,
    updateReRenderAuthorBooks: (isRender: boolean) => {
        set(() => ({
            reRenderAuthorBooks: isRender
        }))
    },
    isAuthorBookFetching: false,
    updateIsAuthorBookFetching: (isFetching: boolean) => {
        set(() => ({
            isAuthorBookFetching: isFetching
        }))
    },
    authorBooks: [],
    addAuthorBooks: (book: RecordModel) => {
        set((state: any) => ({
            authorBooks: [...state.authorBooks, book]
        }))
    },
    emptyAuthorBooks: () => {
        set(() => ({
            authorBooks: [],
            authorBookPage: 1,
            reRenderAuthorBooks: true,
        }))
    },

    // Favourite book
    reRenderFavouriteBooks: true,
    updateReRenderFavouriteBooks: (isRender: boolean) => {
        set(() => ({
            reRenderFavouriteBooks: isRender
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
    favouriteBookPage: 1,
    updateFavouriteBookPage: (page: number) => {
        set(() => ({
            favouriteBookPage: page
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

    // Purchased books
    reRenderPurchasedBooks: true,
    updateReRenderPurchasedBooks: (isRender: boolean) => {
        set(() => ({
            reRenderPurchasedBooks: isRender
        }))
    },
    isPurchasedBooksFetching: false,
    updateIsPurcasedBooksFetching: (isFetching: boolean) => {
        set(() => ({
            isPurchasedBooksFetching: isFetching
        }))
    },
    purchasedBookPage: 1,
    updatePurchasedBookPage: (page: number) => {
        set(() => ({
            purchasedBookPage: page
        }))
    },
    purchasedBooks: [],
    addPurchasedBook: (book: RecordModel) => {
        set((state: any) => ({
            purchasedBooks: [...state.purchasedBooks, book]
        }))
    },
    emptyPurchasedBooks: () => {
        set(() => ({
            purchasedBooks: [],
            purchasedBookPage: 1,
            reRenderPurchasedBooks: true
        }))
    },
    purchasedBookDetails: null,
    updatePurchasedBookDetails: (book: RecordModel) => {
        set(() => ({
            purchasedBookDetails: book
        }))
    },
    emptyPurchasedBookDetails: () => {
        set(() => ({
            purchasedBookDetails: null,
            isPurchasedBookSubmitting: false,
            showPurchasedBookModal: false
        }))
    },

    isPurchasedBookSubmitting: false,
    updateIsPurchasedBookSubmitting: (isSubmitting: boolean) => {
        set(() => ({
            isPurchasedBookSubmitting: isSubmitting
        }))
    },

    showPurchasedBookModal: false,
    updateShowPurchasedBookModal: (show: boolean) => {
        set(() => ({
            showPurchasedBookModal: show
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
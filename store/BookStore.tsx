import { create } from 'zustand'

const fetchBookDetail = async(bookId: string) => {
    return null;
}

export const useBookStore = create((set) => ({
    book: null,
    getBookDetails: async(bookId: string) => {
        const {data} = await fetchBookDetail(bookId);
    }
}));
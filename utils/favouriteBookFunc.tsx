import { pb } from "@/store/PocketbaseStore";
import { makeToast } from "./toastMesage";

// Check if the book is favourite or not
export const isFavouriteBook = async (bookId: string) => {
    let isFav = false;

    try {
        const favBookRecord = await pb.collection('favourite_books').getFirstListItem(`book.id="${bookId}" && user.id="${pb?.authStore?.model?.id}"`);

        if (favBookRecord) {
            isFav = true;
        }
    } catch(err) {
        return isFav;
    }

    return isFav;
}

// Fetch favourite book using book id and user id
export const fetchFavouriteBook = async(bookId: string) => {
    try {
        const favBookRecord = await pb.collection("favourite_books").getFirstListItem(`book.id="${bookId}" && user.id="${pb?.authStore?.model?.id}"`);

        if (favBookRecord) {
            return favBookRecord;
        }
    } catch(err) {
        return null;
    }

    return null
}

export const addToFavouriteBookList = async(bookId: string) => {
    const formData = {
        user: pb?.authStore?.model?.id,
        book: bookId
    }

    try {
        const favBookRecord = await pb.collection('favourite_books').create(formData);
        return favBookRecord;
    } catch (err) {
        return null;
    }
}

// Delete book from favourite list
export const isDeletedFavouriteBook = async(bookId: string) => {
    let isDeleted = false;

    const favBookRecord = await fetchFavouriteBook(bookId);

    if (favBookRecord) {
        try {
            await pb.collection('favourite_books').delete(favBookRecord.id);

            isDeleted = true;
        } catch(err) {
            return isDeleted;
        }
    }

    return isDeleted;
}
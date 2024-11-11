import { pb } from "@/store/PocketbaseStore";
import { makeToast } from "./toastMesage";
import { RecordModel } from "pocketbase";

// Check if the book is favourite or not
export const isFavouriteBook = async ({bookId, signal}: {bookId: string, signal: AbortSignal}) => {
    let isFav = false;

    try {
        const favBookRecord = await pb.collection('favourite_books').getFirstListItem(`book.id="${bookId}" && user.id="${pb?.authStore?.model?.id}"`, {
            signal: signal
        });

        if (favBookRecord) {
            isFav = true;
        }
    } catch(err) {
        return isFav;
    }

    return isFav;
}

// Fetch favourite book using book id and user id
export const fetchFavouriteBook = async({bookId, signal}: {bookId: string, signal: AbortSignal}) => {
    try {
        const favBookRecord = await pb.collection("favourite_books").getFirstListItem(`book.id="${bookId}" && user.id="${pb?.authStore?.model?.id}"`, {
            signal: signal
        });

        if (favBookRecord) {
            return favBookRecord;
        }
    } catch(err) {
        return null;
    }

    return null
}

export const addToFavouriteBookList = async({bookId, signal}: {bookId: string, signal: AbortSignal}) => {
    const formData = {
        user: pb?.authStore?.model?.id,
        book: bookId
    }

    try {
        const favBookRecord = await pb.collection('favourite_books').create(formData, {
            signal: signal
        });
        return favBookRecord;
    } catch (err) {
        return null;
    }
}

// Delete book from favourite list
export const isDeletedFavouriteBook = async({bookId, signal}: {bookId: string, signal: AbortSignal}) => {
    let isDeleted = false;

    const favBookRecord = await fetchFavouriteBook({bookId: bookId, signal: signal});

    if (favBookRecord) {
        try {
            await pb.collection('favourite_books').delete(favBookRecord.id, {
                signal: signal
            });

            isDeleted = true;
        } catch(err) {
            return isDeleted;
        }
    }

    return isDeleted;
}

// Update/Remove book from favourite book list
export const updateBookFavouriteMode = async ({ book, isFav, signal }: { book: RecordModel, isFav: boolean, signal: AbortSignal }) => {
    book.is_favourite = isFav;

    if (isFav) {
        await addToFavouriteBookList({bookId: book.id, signal: signal});
    } else {
        await isDeletedFavouriteBook({bookId: book.id, signal: signal});
    }

    return book;
}
import { RecordModel } from 'pocketbase';
import { create } from 'zustand'
import pb from './PocketbaseStore';

export const fetchAuthorDetails = async ({ authorId }: { authorId: string }) => {
    try {
        const authorRecord: RecordModel = await pb.collection('authors').getOne(authorId);

        return authorRecord;
    } catch (err) {
        return null;
    }
}

export const useAuthorStore = create((set) => ({
    authorDetails: null,
    updateAuthorDetails: (author: RecordModel) => {
        set(() => ({
            authorDetails: author
        }))
    },
    emptyAuthorDetails: () => {
        set(() => ({
            authorDetails: null
        }))
    },
}));
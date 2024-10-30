import { RecordModel } from 'pocketbase';
import { create } from 'zustand'
import { pb } from './PocketbaseStore';

// Fetch all the genres
export const fetchAllGenres = async ({searchText}: {searchText: string}) => {
    try {
        const genreRecords = await pb.collection('genres').getFullList({
            filter: `title~"${searchText}"`
        });

        return genreRecords;
    } catch (err) {
        return [];
    }
}

export const useGenreStore = create((set) => ({
    activeGenre: "",
    updateActiveGenre: (tab: string) => {
        set(() => ({
            activeGenre: tab
        }))
    },
    
    // Only for mobile starts
    showGenreModal: false,
    updateShowGenreModal: (showModal: boolean) => {
        set(() => ({
            showGenreModal: showModal
        }))
    },
    searchGenreText: "",
    updateSearchGenreText: (searchText: string) => {
        set(() => ({
            searchGenreText: searchText
        }))
    },
    // Only for mobile ends

    reRenderGenre: true,
    updateReRenderGenre: (reRender: boolean) => {
        set(() => ({
            reRenderGenre: reRender
        }))
    },
    isFetchingGenre: true,
    updateIsFetchingGenre: (isFetching: boolean) => {
        set(() => ({
            isFetchingGenre: isFetching
        }))
    },
    genres: [],
    addGenres: (genre: RecordModel) => {
        set((state: any) => ({
            genres: [...state.genres, genre]
        }))
    },
    emptyGenres: () => {
        set(() => ({
            genres: []
        }))
    },

    searchedGenres: [],
    addSearchedGenres: (genre: RecordModel) => {
        set((state: any) => ({
            searchedGenres: [...state.searchedGenres, genre]
        }))
    },
    emptySearchedGenres: () => {
        set(() => ({
            searchedGenres: []
        }))
    }
}));
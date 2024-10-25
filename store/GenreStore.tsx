import { create } from 'zustand'

export type GENRE_TYPE = {
    id: string,
    title: string,
    created: DateTime,
    updated: DateTime
}

export const useGenreStore = create((set) => ({
    activeTab: "",
    updateActiveTab: (tab: string) => {
        set(() => ({
            activeTab: tab
        }))
    },
    // Only for mobile starts
    showGenreModal: false,
    updateShowGenreModal: (showModal: boolean) => {
        set(() => ({
            showGenreModal: showModal
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
    addGenres: (genre: any) => {
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
    addSearchedGenres: (genre: any) => {
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
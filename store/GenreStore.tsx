import { create } from 'zustand'

export const useGenreStore = create((set) => ({
    activeTab: -1,
    updateActiveTab: (tab: number) => {
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
    }
    // Only for mobile ends

}));
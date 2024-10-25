import { create } from 'zustand'

export const usePageStore = create((set) => ({
    isPageLoading: true,
    updateIsPageLoading: (isLoading: boolean) => {
        set(() => ({
            isPageLoading: isLoading
        }))
    }
}));
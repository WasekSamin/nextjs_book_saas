import { create } from 'zustand'

export const useHelpRequestStore = create((set) => ({
    isSubmitting: false,
    updateIsSubmitting: (isSubmit: boolean) => {
        set(() => ({
            isSubmitting: isSubmit
        }))
    }
}));
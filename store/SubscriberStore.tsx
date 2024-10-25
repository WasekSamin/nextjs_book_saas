import { create } from 'zustand'

export const useSubscriberStore = create((set) => ({
    isSubmitting: false,
    updateIsSubmitting: (isSubmit: boolean) => {
        set(() => ({
            isSubmitting: isSubmit
        }))
    }
}));
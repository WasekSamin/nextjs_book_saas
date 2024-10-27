import { create } from 'zustand'
import { pb } from './PocketbaseStore';


// Get user full details
const fetchUserDetails = async () => {
    try {
        const userList = await pb.collection('users').getList(1, 1, {
            sort: "-created",
            expand: "profile"
        });

        const { items } = userList;
        const user = items.length ? items[0] : null;

        let profile = null;

        if (user?.expand?.profile) {
            profile = user.expand.profile;
        }

        return {
            user: user,
            profile: profile
        }
    } catch (err) {
        return {
            user: null,
            profile: null
        };
    }
}

export const useUserStore = create((set) => ({
    isUserDataFetching: true,
    updateIsUserDataFetching: (isLoading: boolean) => {
        set(() => ({
            isUserDataFetching: isLoading
        }))
    },
    isUpdateProfilePic: false,
    toggleIsUpdateProfilePic: (isUpdate: boolean) => {
        set(() => ({
            isUpdateProfilePic: isUpdate
        }))
    },
    isProfilePicSubmitting: false,
    updateIsProfilePicSubmitting: (isSubmit: boolean) => {
        set(() => ({
            isProfilePicSubmitting: isSubmit
        }))
    },

    getUserDetails: async () => {
        const { user } = await fetchUserDetails();

        set(() => ({
            user: user
        }));
        // set(() => ({
        //     userProfile: profile
        // }))
        // set(() => ({
        //     isUserDataFetching: false
        // }));
    },

    isUserSubmitting: false,
    updateIsUserSubmitting: (isSubmit: boolean) => {
        set(() => ({
            isUserSubmitting: isSubmit
        }))
    },
}));
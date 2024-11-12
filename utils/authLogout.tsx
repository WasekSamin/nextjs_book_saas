import pb from "@/store/PocketbaseStore";

export const logout = () => {
    pb?.authStore?.clear();
}
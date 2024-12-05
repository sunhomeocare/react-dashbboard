import { create } from "zustand";

export const useUserDetailsStore = create((set) => ({
  userId: "",
  setUserID: (value) => set({ userId: value }),

  username: "",
  setUsername: (value) => set({ username: value }),

  role: "",
  setRole: (value) => set({ role: value }),

  setUser: (value) =>
    set({
      userId: value.id,
      username: value.username,
      role: value.role,
    }),

  removeUser: () =>
    set({
      userId: "",
      username: "",
      role: "",
    }),
}));

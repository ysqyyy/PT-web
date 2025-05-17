import { create } from "zustand";

export type UserState = {
  username: string;
  role: string;
  setUser: (user: { username: string; role: string }) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  username: "",
  role: "",
  setUser: (user) => set(user),
  logout: () => set({ username: "", role: "" }),
}));

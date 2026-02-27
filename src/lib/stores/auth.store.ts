import { create } from "zustand";

export type MockUser = {
  id: string;
  name: string;
  type: "JOBSEEKER" | "EMPLOYER";
  companyId?: string;
  companyName?: string;
};

type AuthState = {
  currentUser: MockUser | null;
  mockUsers: MockUser[];
  setCurrentUser: (user: MockUser) => void;
  setMockUsers: (users: MockUser[]) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  mockUsers: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setMockUsers: (users) => set({ mockUsers: users }),
}));

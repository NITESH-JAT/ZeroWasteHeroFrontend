import { create } from "zustand";
import { AppRole } from "../constants/roles";

type AuthState = "welcome" | "roleSelected";

type AppState = {
  authState: AuthState;
  activeRole: AppRole | null;
  setRole: (role: AppRole) => void;
  resetSession: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  authState: "welcome",
  activeRole: null,
  setRole: (role) => set({ activeRole: role, authState: "roleSelected" }),
  resetSession: () => set({ activeRole: null, authState: "welcome" }),
}));

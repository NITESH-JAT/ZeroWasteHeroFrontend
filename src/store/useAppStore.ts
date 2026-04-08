import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { AppRole } from "../constants/roles";

// Match the exact variable names coming from your backend JSON response
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AppRole;
  greenPoints: number;
}

interface AppState {
  isAuthenticated: boolean;
  activeRole: AppRole | null;
  userProfile: UserProfile | null;
  jwtToken: string | null;
  isHydrating: boolean; // Tells the app if we are still checking secure storage
  
  // Actions
  setAuthData: (userProfile: UserProfile, jwtToken: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  hydrateAuth: () => Promise<void>;
}

const TOKEN_KEY = "zeroWasteHero_jwtToken";

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  activeRole: null,
  userProfile: null,
  jwtToken: null,
  isHydrating: true,

  setAuthData: async (userProfile, jwtToken) => {

    const normalizedProfile = {
      ...userProfile,
      role: (userProfile.role || "citizen").toLowerCase() as AppRole,
    };

    await SecureStore.setItemAsync(TOKEN_KEY, jwtToken);
    
    set({ 
      isAuthenticated: true, 
      activeRole: normalizedProfile.role, 
      userProfile: normalizedProfile, 
      jwtToken 
    });
  },

  logoutUser: async () => {
    // 1. Destroy the token from the hardware to prevent data leaks
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    
    // 2. Wipe the in-memory state
    set({ 
      isAuthenticated: false, 
      activeRole: null, 
      userProfile: null, 
      jwtToken: null 
    });
  },

  hydrateAuth: async () => {
    try {
      // Check if the user logged in previously when the app boots up
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      
      if (savedToken) {
        // We have a token! We will update state, but in the next step 
        // we will also need to fetch the fresh user profile from the backend.
        set({ jwtToken: savedToken, isAuthenticated: true, isHydrating: false });
      } else {
        set({ isHydrating: false });
      }
    } catch (error) {
      console.error("SecureStore hydration failed:", error);
      set({ isHydrating: false });
    }
  },
}));
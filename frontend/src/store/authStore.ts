import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
  setGuestUser: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isGuest: false,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.removeItem("guestUser");

    set({
      token,
      user,
      isAuthenticated: true,
      isGuest: false,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guestUser");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isGuest: false,
    });
  },

  setGuestUser: (name) => {
    const guestUser = {
      id: `guest_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
    };
    localStorage.setItem("guestUser", JSON.stringify(guestUser));
    
    set({
      token: null,
      user: guestUser,
      isAuthenticated: false,
      isGuest: true,
    });
  },

  initialize: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        isGuest: false,
      });
      return;
    }

    const guestUser = localStorage.getItem("guestUser");
    if (guestUser) {
      set({
        token: null,
        user: JSON.parse(guestUser),
        isAuthenticated: false,
        isGuest: true,
      });
    }
  },
}));
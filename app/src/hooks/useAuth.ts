import { useEffect } from "react";
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import { axiosInstance } from "../services/api-client";
import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

interface UserStore {
  signedIn: boolean;
  login: () => void;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  signedIn: false,
  login: () => set(() => ({ signedIn: true })),
  logout: () => set(() => ({ signedIn: false })),
}));

if (process.env.NODE_ENV === "development")
  mountStoreDevtool("Counter store", useUserStore);

const useAuth = () => {
  const { signedIn, login, logout } = useUserStore();

  // Check to see if we're already signed in
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      axiosInstance.defaults.headers.common = { Authorization: authToken };
      login();
    }
  }, []);

  const apiSignIn = (
    codeResponse: Omit<
      TokenResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    axiosInstance.post("/signin", codeResponse).then((token) => {
      localStorage.setItem("authToken", token.data);
      axiosInstance.defaults.headers.common = { Authorization: token.data };
      login();
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => apiSignIn(codeResponse),
    onError: (error) => {
      throw error;
    },
  });

  const onLogout = function () {
    googleLogout();
    localStorage.removeItem("authToken");
    axiosInstance.defaults.headers.common = {};
    logout();
  };

  return { signedIn, onLogin: googleLogin, onLogout };
};

export default useAuth;
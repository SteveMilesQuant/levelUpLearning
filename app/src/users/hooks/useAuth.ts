import { useEffect, useState } from "react";
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import { axiosInstance } from "../../services/api-client";
import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { useQueryClient } from "@tanstack/react-query";
import useShoppingCart from "../../hooks/useShoppingCart";

interface UserStore {
  signedIn: boolean;
  expiration?: Date;
  login: (expiration: Date) => void;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  signedIn: false,
  expiration: undefined,
  login: (expiration: Date) => set(() => ({ signedIn: true, expiration })),
  logout: () => set(() => ({ signedIn: false, expiration: undefined })),
}));

if (process.env.NODE_ENV === "development")
  mountStoreDevtool("User store", useUserStore);

const useAuth = () => {
  const { signedIn, expiration, login, logout } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);
  const queryClient = useQueryClient();
  const { clearCart } = useShoppingCart();

  // Check to see if we're already signed in
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const tokenExpiration = localStorage.getItem("authTokenExpiration");
    if (authToken) {
      axiosInstance.defaults.headers.common = { Authorization: authToken };
      login(new Date(tokenExpiration + "Z"));
    }
    setIsChecking(false);
  }, []);

  const apiSignIn = (
    codeResponse: Omit<
      TokenResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    axiosInstance.post("/signin", codeResponse).then((response) => {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("authTokenExpiration", response.data.expiration);
      axiosInstance.defaults.headers.common = {
        Authorization: response.data.token,
      };
      login(new Date(response.data.expiration + "Z"));
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
    localStorage.removeItem("authTokenExpiration");
    axiosInstance.defaults.headers.common = {};
    queryClient.clear();
    clearCart();
    logout();
  };

  return { signedIn, expiration, isChecking, onLogin: googleLogin, onLogout };
};

export default useAuth;

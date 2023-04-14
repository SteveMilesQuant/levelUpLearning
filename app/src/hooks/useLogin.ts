import { useEffect } from "react";
import apiClient from "../services/api-client";
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";

const useLogin = (
  setSignedIn: (signedIn: boolean) => void,
  onError: (message: string) => void
) => {
  // Check to see if we're already signed in
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      apiClient.defaults.headers.common = { Authorization: authToken };
      setSignedIn(true);
    }
  }, []);

  const apiSignIn = (
    codeResponse: Omit<
      TokenResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    apiClient.post("/signin", codeResponse).then((token) => {
      localStorage.setItem("authToken", token.data);
      apiClient.defaults.headers.common = { Authorization: token.data };
      setSignedIn(true);
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => apiSignIn(codeResponse),
    onError: (error) => onError("Login Failed: " + error),
  });

  const logout = function () {
    googleLogout();
    localStorage.removeItem("authToken");
    apiClient.defaults.headers.common = {};
    setSignedIn(false);
  };

  return { onLogin: googleLogin, onLogout: logout };
};

export default useLogin;

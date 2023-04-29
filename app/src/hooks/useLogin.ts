import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import apiClient from "../services/old-api-client";
import { axiosInstance } from "../services/api-client";

const useLogin = (
  setSignedIn: (signedIn: boolean) => void,
  onError: (message: string) => void
) => {
  const navigate = useNavigate();

  // Check to see if we're already signed in
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      apiClient.defaults.headers.common = { Authorization: authToken };
      axiosInstance.defaults.headers.common = { Authorization: authToken };
      setSignedIn(true);
    } else {
      // Ensure that if we're not signed in, we navigate back to the home page
      navigate("/");
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
      axiosInstance.defaults.headers.common = { Authorization: token.data };
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
    axiosInstance.defaults.headers.common = {};
    setSignedIn(false);
    navigate("/");
  };

  return { onLogin: googleLogin, onLogout: logout };
};

export default useLogin;

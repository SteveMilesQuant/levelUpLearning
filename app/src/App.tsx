// @ts-nocheck
import { useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import apiClient from "./services/api-client";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);

  const apiSignIn = (codeResponse) => {
    apiClient.post("/signin", codeResponse).then((token) => {
      apiClient.defaults.headers.common = { Authorization: token.data };
      console.log(token);
      apiClient.get("/roles").then((response) => {
        setRoles(response.data ? response.data : []);
      });
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => apiSignIn(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const logout = function () {
    googleLogout();
    setRoles([]);
  };

  return (
    <>
      <h1>Hello from LUL</h1>
      {!isLoggedIn && (
        <div>
          <button onClick={() => googleLogin()}>
            <FcGoogle size={16} />
            <span>Sign In</span>
          </button>
        </div>
      )}
      {isLoggedIn && (
        <div>
          <button onClick={logout}>Log Out</button>
        </div>
      )}
      <ul>
        <h2>My roles</h2>
        {roles.map((roles) => (
          <li>{roles.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState("normal");
  useEffect(() => {
    hasToken();
  }, []);
  const decodeToken = (token) => {
    const decoded = jwtDecode(token);
    setUserType(decoded.userType);
  };
  const hasToken = () => {
    let token = Cookies.get("token");
    if (token) {
      decodeToken(token);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  };
  const setToken = (token) => {
    localStorage.setItem("token", token); 
    localStorage.setItem("tk", token); 
    Cookies.set("token", token);
    Cookies.set("token2", token);
    Cookies.set("token", token, {path: '', domain: 'nps.herovired.com'});
    Cookies.set("token1", token, {path: '', domain: '.herovired.com'})
    decodeToken(token);
    setIsLoggedIn(true);
  };
  const removeToken = () => {
    Cookies.remove("token");
    localStorage.removeItem('token')
    localStorage.removeItem('tk')
    setUserType("normal");
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userType, setToken, removeToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

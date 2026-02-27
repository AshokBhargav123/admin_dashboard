import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";

export const login = () => {
  Cookies.set(TOKEN_KEY, "dummy_token", { expires: 1 });
};

export const logout = () => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!Cookies.get(TOKEN_KEY);
};
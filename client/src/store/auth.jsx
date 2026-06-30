import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { authApi } from "../api/auth.js";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  session: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SESSION":
      return { user: action.user, session: action.session, loading: false };
    case "LOGOUT":
      return { user: null, session: null, loading: false };
    case "LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("4wheels_token");
    if (!token) {
      dispatch({ type: "LOGOUT" });
      return;
    }
    authApi
      .getSession()
      .then((json) => {
        dispatch({ type: "SET_SESSION", user: json.user, session: { access_token: token } });
      })
      .catch(() => {
        localStorage.removeItem("4wheels_token");
        dispatch({ type: "LOGOUT" });
      });
  }, []);

  useEffect(() => {
    const handler = () => dispatch({ type: "LOGOUT" });
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: "LOADING" });
    try {
      const json = await authApi.login(email, password);
      localStorage.setItem("4wheels_token", json.session.access_token);
      dispatch({ type: "SET_SESSION", user: json.user, session: json.session });
      return json;
    } catch (err) {
      dispatch({ type: "LOGOUT" });
      throw new Error(err.response?.data?.error || "Login failed");
    }
  }, []);

  const signup = useCallback(async (email, password, options) => {
    dispatch({ type: "LOADING" });
    try {
      const json = await authApi.signup(email, password, options);
      if (json.session) {
        localStorage.setItem("4wheels_token", json.session.access_token);
      }
      dispatch({ type: "SET_SESSION", user: json.user, session: json.session });
      return json;
    } catch (err) {
      dispatch({ type: "LOGOUT" });
      throw new Error(err.response?.data?.error || "Signup failed");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    localStorage.removeItem("4wheels_token");
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

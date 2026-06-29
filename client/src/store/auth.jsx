import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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
    fetch(`${API}/auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("invalid");
        return res.json();
      })
      .then((json) => {
        dispatch({ type: "SET_SESSION", user: json.user, session: { access_token: token } });
      })
      .catch(() => {
        localStorage.removeItem("4wheels_token");
        dispatch({ type: "LOGOUT" });
      });
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: "LOADING" });
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Login failed");
    localStorage.setItem("4wheels_token", json.session.access_token);
    dispatch({ type: "SET_SESSION", user: json.user, session: json.session });
    return json;
  }, []);

  const signup = useCallback(async (email, password, options) => {
    dispatch({ type: "LOADING" });
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, options }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Signup failed");
    if (json.session) {
      localStorage.setItem("4wheels_token", json.session.access_token);
    }
    dispatch({ type: "SET_SESSION", user: json.user, session: json.session });
    return json;
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("4wheels_token");
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
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

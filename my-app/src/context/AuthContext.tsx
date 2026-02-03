import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
// import type { User } from "../Interface/IUser";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  id: number;
  sub: string;
  exp: number;
  iat: number;
  token_type: "access" | "refresh";
};

type AuthContextType = {
  id: number | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  authLoading: boolean;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [id, setId] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const login = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);

    setAccessToken(token);
    setId(decoded.id);
  };

  const refresh = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}refresh"`,
        {},
        {
          withCredentials: true,
        },
      );
      login(res.data.access_token);
    } catch {
      setAccessToken(null);
      setId(null);
    } finally {
      setAuthLoading(false);
    }
  };
  useEffect(() => {
    // attach token on every request
    const reqId = axios.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(reqId);
    };
  }, [accessToken]);

  const logout = async () => {
    try {
      await axios.post(`${apiUrl}logout`);
    } finally {
      setAccessToken(null);
      setId(null);
    }
  };
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        id,
        accessToken,
        isAuthenticated: !!accessToken,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

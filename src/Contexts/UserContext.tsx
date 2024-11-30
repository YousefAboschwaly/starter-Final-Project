// UserContext.tsx
import { createContext, useState, ReactNode, useEffect } from "react";

// Define the context type
interface UserContextType {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({ children }: { children: ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      setUserToken(storedToken);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
}

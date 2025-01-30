// UserContext.tsx
import { createContext, useState, ReactNode } from "react";

// Define the context type
interface UserContextType {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  userId:string | null;
  setUserId: (value: string | null ) => void;
  isMakeOtp: boolean;
  setIsMakeOtp: (value: boolean) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string|null>(
    () => localStorage.getItem("user-id") || null
  );
  const [userToken, setUserToken] = useState<string | null>(
    () => localStorage.getItem("userToken") || null
  );
    const [isMakeOtp, setIsMakeOtp] = useState<boolean>(false);
    

  return (
    <UserContext.Provider value={{ userToken, setUserToken,userId, setUserId , isMakeOtp, setIsMakeOtp}}>
      {children}
    </UserContext.Provider>
  );
}

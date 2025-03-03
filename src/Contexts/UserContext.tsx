import { createContext, useState, ReactNode, useEffect } from "react";

// Define the context type
interface UserContextType {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  userId: number | null;
  setUserId: (value: number | null) => void;
  isMakeOtp: boolean;
  setIsMakeOtp: (value: boolean) => void;
  showAddProject:boolean;
  setShowAddProject:(val:boolean)=>void;
  pathUrl:string;
  setPathUrl:(val:string)=>void;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({ children }: { children: ReactNode }) {
  const initialUserId = localStorage.getItem("user-id");
  console.log("Initial user-id from localStorage:", initialUserId);
  const [userId, setUserId] = useState<number | null>(
    () => JSON.parse(initialUserId!) as number | null
  );
  const [userToken, setUserToken] = useState<string | null>(
    () => localStorage.getItem("userToken") || null
  );
  const [isMakeOtp, setIsMakeOtp] = useState<boolean>(false);
  const [showAddProject, setShowAddProject] = useState(false)
  const [pathUrl, setPathUrl] = useState(`https://home4u.gosoftcloud.com`)

  useEffect(() => {
    console.log("Updating localStorage user-id:", userId);
    localStorage.setItem("user-id", JSON.stringify(userId));
  }, [userId]);

  useEffect(() => {
    console.log("Updating localStorage userToken:", userToken);
    localStorage.setItem("userToken", userToken || "");
  }, [userToken]);

  return (
    <UserContext.Provider value={{ userToken, setUserToken, userId, setUserId, isMakeOtp, setIsMakeOtp , showAddProject, setShowAddProject,pathUrl,setPathUrl}}>
      {children}
    </UserContext.Provider>
  );
}

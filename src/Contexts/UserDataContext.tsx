import { createContext, useState, ReactNode } from "react";

// Define the type for user data
interface UserType {
  id: number;
  statusCode: number;
  username: string;
  email: string;
  phone: string;
  userType: {
    id: number;
    code: string;
    name: string;
  };
  governorate: string | null;
  city: string | null;
}

// Define the context value type
interface UserDataContextType {
  userData: UserType | null;
  setUserData: React.Dispatch<React.SetStateAction<UserType | null>>;
  engineerData: any; // Replace 'any' with a specific type if possible
  setEngineerData: React.Dispatch<React.SetStateAction<any>>;
  workerData: any; // Replace 'any' with a specific type if possible
  setWorkerData: React.Dispatch<React.SetStateAction<any>>;
}

// Create context with an initial empty object but cast it correctly
export const UserDataContext = createContext<UserDataContextType | null>(null);

export default function UserContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [engineerData, setEngineerData] = useState<any>({});
  const [workerData, setWorkerData] = useState<any>({});

  return (
    <UserDataContext.Provider value={{ userData, setUserData, engineerData, setEngineerData, workerData, setWorkerData }}>
      {children}
    </UserDataContext.Provider>
  );
}

import { createContext, ReactNode, useEffect, useState } from "react";

interface UserContextType {
  userToken: string|null;
  setUserToken: React.Dispatch<React.SetStateAction<string>>;
}
export let UserContext = createContext<UserContextType>(null);
export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userToken, setUserToken] = useState("");

  useEffect(()=>{
    if(localStorage.getItem('userToken')){
      setUserToken(localStorage.getItem('userToken') as string)
    }
  },[])


  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
}


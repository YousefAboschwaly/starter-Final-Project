
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}:{children:ReactNode}) {

if(localStorage.getItem('userToken')){
  return <>{children}</>
}

else{
 return <Navigate to='/client'/>
}


}

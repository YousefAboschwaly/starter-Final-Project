import ClientHome from "./clientHome"

export default function Home() {




  if(localStorage.getItem('user-type') ==='general user'){
    return <ClientHome />;
  }
  return (
    <>

 
    </>
  )
}
import LandingPage from "../LandingPage/LandingPage.tsx";

export default function Home() {




  if(localStorage.getItem('user-type') ==='general user' || localStorage.getItem('user-type') === null) {
    return <LandingPage />;
  }
  return (
    <>

 
    </>
  )
}
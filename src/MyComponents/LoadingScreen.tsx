import { useState , useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import logo from '/Logo.png?url';
export default function LoadingScreen() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3300);
    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, []);

  return(
<>

{ loading &&<div className="flex flex-col justify-center items-center h-screen w-full bg-gray-600 bg-opacity-60 fixed top-0 bottom-0 z-30 ">
    <div className=" flex justify-center items-center gap-4 my-8 ">
      <img src={logo} alt="logo" className='w-[30rem]  align-middle'/>
    </div>
        <ThreeDots
          visible={true}
          height="120"
          width="120"
          color="green"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      </div>}
</>
  )
}

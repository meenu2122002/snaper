import {Outlet,Navigate} from "react-router-dom"

const AuthLayout = () => {

    const isAuthenticated=false;
  return (
   <>
   {
    isAuthenticated?<>
    <Navigate to="/"/>
    </>:<>
    <section className=" flex flex-1 flex-col justify-center items-center">
        <Outlet/>
    </section>
    <img src={"/assets/images/side-img.svg"}
     alt="logo"
     className="h-screen w-1/2 object-cover bg-no-repeat "
     />
   
   
    

    </>
   }
   
   </>
  )
}

export default AuthLayout
import * as z from "zod"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Loader from "../../components/shared/Loader"
import { useNavigate } from "react-router-dom"

import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}


  from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInValidation} from "@/lib"

import { useSignInAccountMutation } from "@/lib/tanstackreact-query/queriesAndMutations";
import { Interface } from "readline"



const SignInForm = () => {
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: checkingAuthAfterCreatingEmailSession } = useContext(AuthContext)
  const { toast } = useToast()
 
  const { mutateAsync: signInAccount, isPending: iFSigningIn } = useSignInAccountMutation();


  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      
      email: "",
      password: "",

    },
  })
  const [password, setPassword] = useState("password")
  const handleclick = () => {
    console.log(password)
    if (password == "text") {
      setPassword("password")

    }
    else {
      setPassword("text")
    }
  }

  async function onSubmit(values: z.infer<typeof SignInValidation>) {
   
    const session= await signInAccount({
      email: values.email,
      password: values.password
    })
   
    // const parsedData=await session.json();
    // console.log(JSON.parse(session));
    if (!session) {
      return toast({
        title: "Sign In failed ,Please try again",

      })
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/")
    }
    else {
      return toast({
        title: "Please try again",

      })
    }
  }
  return (
    <div className="sm:w-420  flex-col flex justify-center items-center ">
      <img src="/assets/images/logo.svg" alt="logo"
      />
      <h2 className="h3-bold md:h2-bold sm:pt-3">Log In to your  account</h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back to snapGram,please enter your details</p>
      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
         
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="  relative flex justify-between items-center  ">
                    <Input type={`${password}`} className="shad-input" {...field} />
                    {(password == "text") ? <>
                      <span onClick={handleclick} className={`cursor-pointer bg-transparent absolute right-2 text-white text-lg`}><AiFillEye /></span>
                    </> : <>
                      <span onClick={handleclick} className={`cursor-pointer bg-transparent absolute right-2 text-white} text-xl`}><AiFillEyeInvisible /></span></>
                    }
                  </div>

                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="shad-button_primary">
            {
              checkingAuthAfterCreatingEmailSession ? <>
                <div >
                  <Loader />
                </div>
              </> : "Sign In"
            }
          </Button>
          <p
            className="text-center text-light-2"
          >Don't have an account?
            <Link to="/signup" className="text-primary-500">
             Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>


  )
}

export default SignInForm

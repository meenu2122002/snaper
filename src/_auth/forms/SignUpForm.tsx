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
import { SignUpValidation } from "@/lib"

import { useCreateUserAccountMutation, useSignInAccountMutation } from "@/lib/tanstackreact-query/queriesAndMutations";



const SignUpForm = () => {
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: isSigningIn } = useContext(AuthContext)
  const { toast } = useToast()
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccountMutation()
  const { mutateAsync: signInAccount, isPending: iFSigningIn } = useSignInAccountMutation();


  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "", 
      name: "",
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

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({
        title: "Sign Up failed ,Please try again",

      })
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })
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
      <h2 className="h3-bold md:h2-bold sm:pt-3">Create a new account</h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">To use Snapgram,please enter your details</p>
      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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
              isCreatingUser ? <>
                <div >
                  <Loader />
                </div>
              </> : "Sign Up"
            }
          </Button>
          <p
            className="text-center text-light-2"
          >Already have an account?
            <Link to="/signin" className="text-primary-500">
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </div>


  )
}

export default SignUpForm

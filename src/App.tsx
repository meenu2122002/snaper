import "./globals.css"
import { Routes, Route } from "react-router-dom"
import SignInForm from "./_auth/forms/SignInForm"
import SignUpForm from "./_auth/forms/SignUpForm"
import { AllUsers, CreatePost, EditPost, Explore, Home, PostsDetails, Profile, Saved, UpdateProfile } from "./_root/pages"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Toaster } from "@/components/ui/toaster"




const App = () => {
  return (
    <div className="flex h-screen ">

      <Routes>
        {/* {public routes} */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostsDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />

        </Route>
        {/* {private routes} */}

      </Routes>
      <Toaster />
    </div>
  )
}

export default App

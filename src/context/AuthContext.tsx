import { getCurrentUser } from "@/lib/appwrite/api"
import { IContextType, IUser } from "@/types"
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export const initialUser = {
    id: "",
    username: "",
    name: "",
    email: "",
    imageUrl: "",
    bio: ""
}
const InitialState = {
    user: initialUser,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean
}
export const AuthContext = createContext<IContextType>(InitialState)


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(initialUser)
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate();



    const checkAuthUser = async () => {
        setIsLoading(true);
        try {


            const currentAccount = await getCurrentUser();
            console.log(currentAccount)
            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio
                })
                setIsAuthenticated(true)
                return true;
            }

            return false;
        } catch (error) {
            console.log(error)
            return false
        } finally {
            setIsLoading(false)
        }

    }

    
    useEffect(() => {
        if (localStorage.getItem('cookieFallback') === '[]' || localStorage.getItem('cookieFallback') === null) {
            console.log("hii")
            navigate('/signin')
        }
        console.log("hello")

        checkAuthUser();
    }, [])






    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, setIsAuthenticated, setUser, checkAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccountMutation } from "@/lib/tanstackreact-query/queriesAndMutations"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { AuthContext } from "@/context/AuthContext"
import {useContext } from "react"


const TopBar = () => {
    const navigate = useNavigate();
    const {user}=useContext(AuthContext)
    const { mutate: signOut, isSuccess } = useSignOutAccountMutation();
    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
    }, [isSuccess])


    return (
        <div className="topbar">

            <div className="flex-between">
                <Link to="/">
                    <img
                        src="/assets/images/logo.svg"
                        alt="logo"
                        width={130}
                        height={325}
                    />
                </Link>
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        className=".shad-button_ghost"
                        onClick={() => {
                            signOut();
                        }}
                    >
                        <img src="/assets/icons/logout.svg" alt="logout"

                        />
                    </Button>
                    <Link to={`/profile/${user.id}`}>
<img src={`${user.imageUrl || '/assets/icons/profile-placeholder.svg'}`} alt="user-profile-image" 
className="w-10 h-10 rounded-full"
/>

                    </Link>
                </div>
            </div>


        </div>
    )
}

export default TopBar
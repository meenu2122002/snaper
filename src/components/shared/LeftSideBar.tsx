import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccountMutation } from "@/lib/tanstackreact-query/queriesAndMutations"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { AuthContext } from "@/context/AuthContext"
import { useContext } from "react"
import { useLocation } from "react-router-dom"
import { sidebarLinks } from "@/_constants"
import { NavLink } from "react-router-dom"
const LeftSideBar = () => {

    const { pathname } = useLocation()
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)
    const { mutate: signOut, isSuccess } = useSignOutAccountMutation();
    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
    }, [isSuccess])



    return (
        <nav className="leftsidebar ">
            <div className="flex flex-col gap-8">
                <Link to="/">
                    <img
                        src="/assets/images/logo.svg"
                        alt="logo"
                        width={170}
                        height={36}
                    />
                </Link>

                <Link to={`/profile/${user.id}`}
                    className="flex items-center gap-3 justify-start"
                >
                    <img src={`${user.imageUrl || '/assets/icons/profile-placeholder.svg'}`} alt="user-profile-image"
                        className="w-14 h-14 rounded-full"
                    />
                    <div className="capitalize flex flex-col justify-start items-start">
                        <p className="font-bold">{user.name}</p>
                        <p className="small-regular text-light-3">@${user.username}</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col gap-4 mt-4">

                {
                    sidebarLinks.map((link, index) => {
                        return <>
                            <li className={`leftsidebar-link group  ${pathname == link.route ? "bg-primary-500 " : ""}`}>

                                <NavLink to={link.route}
                                    className="flex gap-4 items-center p-4"
                                >
                                    <img
                                        src={link.imgURL}
                                        alt={link.label}
                                        className={`group-hover:invert-white ${link.route == pathname ? "invert-white" : ""}`}
                                    />
                                    {link.label}

                                </NavLink>
                            </li>
                        </>
                    })
                }
                <button
                    
                   className="flex gap-4 px-4"
                    onClick={() => {
                        signOut()
                    }}
                >
                    <img src="/assets/icons/logout.svg" alt="logout"

                    />
                    Logout
                </button>
            </div>

        </nav>
    )
}

export default LeftSideBar
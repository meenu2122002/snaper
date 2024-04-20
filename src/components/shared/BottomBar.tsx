import { bottombarLinks } from "@/_constants";
import { Link, Outlet } from "react-router-dom"
import { useLocation } from "react-router-dom"


const BottomBar = () => {
  const {pathname}=useLocation();
  return (
   <section className="bottom-bar">
 {
                  bottombarLinks.map((link, index) => {
                        return <>
                            <li className={`leftsidebar-link group  ${pathname == link.route ? "bg-primary-500 " : ""}`} key={index}>

                                <Link to={link.route}
                                    className="flex gap-1 flex-col items-center p-2 tiny-medium"
                                >
                                    <img
                                        src={link.imgURL}
                                        alt={link.label}
                                        width={16}
                                        height={16}
                                        className={`group-hover:invert-white ${link.route == pathname ? "invert-white" : ""}`}
                                    />
                                    {link.label}

                                </Link>
                            </li>
                        </>
                    })
                }
   </section>
  )
}

export default BottomBar
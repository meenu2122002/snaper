import { Models } from "appwrite"
import { Link } from "react-router-dom";
import { calTime } from "@/lib/utils";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import PostStats from "./PostStats";
const PostCard = (props: { post: Models.Document }) => {
    const {user}=useContext(AuthContext)
    const { post } = props;
    console.log(post.imageUrl,"tags");
    return (
        <div className="post-card">
            <div className="flex-between">
                <div className="flex justify-start gap-2 items-center">
                    <Link to={`/profile/${post.creator?.$id}`}>
                        <img src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="" className="w-12 h-12 rounded-full" />

                    </Link>
                    <div>
                        <p className="lg:body-bold text-light-1 ">{post.creator.name}</p>
                        <div className="flex-center gap-2 text-light-3">
                            <p>{calTime(post.$createdAt)}</p>-
                            <p>{post.location}</p>
                        </div>
                    </div>
                </div>
                {
                    post.creator.$id===user.id ?<>
                    <Link to={`/update-post/${post.$id}`}>
                    <img 
                    src="/assets/icons/edit.svg"
                     alt="edit" 
                     width={20}
                     height={20}/>
                </Link>
                    </>:""
                }
            </div>

<Link to={`/posts/${post.$id}`}>


    <div className="py-5">
       <p> {post.caption}</p>
       <ul className="flex gap-1 mt-2">
        {
            post.tags.map((tag:string)=>{
             return   <li className="text-light-3">
                    #{tag}
                </li>
            })
        }
       </ul>
    </div>
<img src={post.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="post-card-image"
className="post-card_img"
/>
</Link>
<PostStats userId={user.id} post={post}/>
        </div>
    )
}

export default PostCard
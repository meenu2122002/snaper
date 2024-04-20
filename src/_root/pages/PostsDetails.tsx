import { useDeletedPost, useGetPostById } from "@/lib/tanstackreact-query/queriesAndMutations"
import { calTime } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const PostsDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { mutate: deletePost } = useDeletedPost();
  const { user } = useContext(AuthContext);

  const handleDeleteClick = async () => {
    deletePost({ postId: post?.$id || "", imageId: post?.imageId });

      // if(deletedPost)
      // return deletePost;
      // else 
      // {toast({
      //   title: "Please try again",

      // })
      navigate("/")
}


return (
  <div className="post_details-container">

    {isPending && <Loader />}
    <div className="post_details-card">
      <img src={post?.imageUrl} alt="postDetails"

        className="post_details-img"
      />
      <div className="post_details-info">
        <div className="flex-between w-full">
          <Link to={`/profile/${post?.creator?.$id}`}
            className="flex items-center gap-3"
          >
            <img src={post?.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="" className="w-8 h-8 rounded-full lg:w-12 lg:h-12" />


            <div>
              <p className="lg:body-bold text-light-1 ">{post?.creator.name}</p>
              <div className="flex-center gap-2 text-light-3">
                <p>{calTime(post?.$createdAt || "")}</p>-
                <p>{post?.location}</p>
              </div>
            </div>
          </Link>
          {user.id === post?.creator.$id && <>

            <div className="flex-center gap-4">
              <Link to={`/update-post/${post?.$id}`}>
                <img src="/assets/icons/edit.svg" alt="" width={24} height={24} />
              </Link>
              <Button
                onClick={handleDeleteClick}
                variant="ghost"
                className="ghost_details-delete_btn"
              >
                <img src="/assets/icons/delete.svg" alt="delete"
                  width={24}
                  height={24}

                />



              </Button>
            </div>
          </>}

        </div>
        <hr className="border w-full border-dark-4/80" />
        <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
          <p> {post?.caption}</p>
          <ul className="flex gap-1 mt-2">
            {
              post?.tags.map((tag: string) => {
                return <li className="text-light-3">
                  #{tag}
                </li>
              })
            }
          </ul>
        </div>
        <div className="w-full">

          {
            post && <PostStats post={post} userId={user.id} />
          }
        </div>
        {/* {
                    post?.creator.$id===user.id ?<>
                    <Link to={`/update-post/${post?.$id}`}>
                    <img 
                    src="/assets/icons/edit.svg"
                     alt="edit" 
                     width={20}
                     height={20}/>
                </Link>
                    </>:""
                } */}
      </div>

    </div>

  </div>
)
}

export default PostsDetails
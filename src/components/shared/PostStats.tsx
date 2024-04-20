import { useDeleteSavedPost, useGetCurrentUser, useLikedPost, useSavePost } from "@/lib/tanstackreact-query/queriesAndMutations"
import { Models } from "appwrite"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "@/context/AuthContext"
type Post = {
  post: Models.Document,
  userId: string
}

const PostStats = ({ post, userId }: Post) => {
// console.log(post)
  const likesList = post?.likes?.map((user: Models.Document) => user.$id);
  // console.log(likesList)
  const [likes, setLikes] = useState<string []>(likesList);
  const [isSaved, setisSaved] = useState(false);
  const { mutate: likePost } = useLikedPost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();
  const { user } = useContext(AuthContext);
  const savedpostcard = currentUser?.save.find((record: Models.Document) => {
    return record.post.$id === post?.$id;
  });
 
  
  // console.log("type of",savedpostcard)
  useEffect(() => {
    setisSaved(!!savedpostcard);
  }, [currentUser]);
  function checkIsLiked( userId: string) {
    const isLiked = likes.find((item: string) => {
      return item === userId;
    });
    try {
      if (isLiked)
        return true;
      else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  const handleLikedPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let currLikedList=[...likes]
    const hasLiked = currLikedList.includes(user.id);
    if (hasLiked) {
      currLikedList = likes.filter((id: string) => {
        return (id != user.id);
      });

    }
    else {
      currLikedList.push(user.id);
    }
    setLikes(currLikedList);
    likePost({ postId: post?.$id || "", likesArray: currLikedList });


  }
  const handleSavedPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      setisSaved(false);
      return deleteSavedPost({savedRecordId:savedpostcard.$id});
    }

    savePost({ userId: userId, postId: post?.$id || ""});
    setisSaved(true);






  }

  // useEffect(() => {

  // }, [isSaved, likesList])


  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img src={`${checkIsLiked( user.id) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}`} alt=""
          width={20}
          height={20}

          onClick={handleLikedPost}
          className="cursor-pointer"
        />

        <p className="small-medium lg:base-medium">{likes?.length || 0}</p>
      </div>
      <div className="flex gap-2 mr-5">
        <img src={`${isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}`} alt=""
          width={20}
          height={20}
          onClick={handleSavedPost}
          className="cursor-pointer"
        />


      </div>
    </div>
  )
}

export default PostStats
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/tanstackreact-query/queriesAndMutations";
import { Models } from "appwrite";


const Home = () => {
 const {data:posts,isPending:isPostLoading,isError:isErrorPosts}=useGetRecentPosts();
 console.log("posts",posts);
  return (
   <div className="home-container">
    <h2 className="h3-bold md:h2-bold text-left">
      Home Feed
    </h2>
    {
      isPostLoading && !posts?<Loader/>:<>
      <ul className="flex flex-1 flex-col w-full gap-9">
{
  posts?.documents.map((post:Models.Document)=>{
    return <>
    <PostCard post={post}/>
    </>
  })
}
      </ul>
      
      </>
    }
   </div>
  )
}

export default Home
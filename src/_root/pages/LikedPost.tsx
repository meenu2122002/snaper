import GridPostList from "@/components/shared/GridPostList";
import { useGetCurrentUser } from "@/lib/tanstackreact-query/queriesAndMutations";
import { Loader } from "lucide-react";


const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();
console.log(currentUser)
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.pliked?.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.pliked} showStats={false} />
    </>
  );
};

export default LikedPosts;
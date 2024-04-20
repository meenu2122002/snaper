import PostForms from "@/components/forms/PostForms"
import { useGetPostById } from "@/lib/tanstackreact-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom"

const EditPost = () => {
  const {id}=useParams();
 
  const {data,isPending}=useGetPostById(id || "");
  console.log(data)
  if(isPending){
    return <>
    
    <Loader/></>
  }
  return (
    <div className="common-container">
<div className="flex gap-3 items-center justify-start w-full">
  <img src="/assets/icons/add-post.svg" alt="" 
  width={36}
  height={36}
  
  />
  <p className="h3-bold md:h2-bold text-left w-full">Edit Post</p>
</div>
<PostForms action="Update" post={data}/>
    </div>
  )
}

export default EditPost
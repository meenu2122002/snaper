import PostForms from "@/components/forms/PostForms"

const CreatePost = () => {
  return (
    <div className="common-container">
<div className="flex gap-3 items-center justify-start w-full">
  <img src="/assets/icons/add-post.svg" alt="" 
  width={36}
  height={36}
  
  />
  <p className="h3-bold md:h2-bold text-left w-full">Create Post</p>
</div>
<PostForms action="Create"/>
    </div>
  )
}

export default CreatePost
import GridPostList from "@/components/shared/GridPostList"
import SearchResults from "@/components/shared/SearchResults"
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/usedebounce"
import { useGetPosts, useSearchPost } from "@/lib/tanstackreact-query/queriesAndMutations"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useInView } from 'react-intersection-observer';

const Explore = () => {
const {data:posts,fetchNextPage,hasNextPage}=useGetPosts();
const { ref, inView } = useInView();
console.log(posts)
const [searchValue, setsearchValue] = useState("")
const {data:SearchPosts,isFetching:isSearchFetching}=useSearchPost(searchValue);
const debouncedValue=useDebounce(searchValue,500);
  const shouldShowSearchResults=searchValue!=='';
  const shouldShowPost=!shouldShowSearchResults && posts?.pages.every((item)=>item?.documents.length===0) ;

useEffect(() => {
 if(inView && !searchValue){
  fetchNextPage();
 }
}, [inView,searchValue])


  if(!posts){
    return <Loader/>
  }
  return (
   <div  className="explore-container">
<div className="explore-inner_container">
<h2 className="h3-bold md:h2-bold w-full ">Search Post</h2>
<div className=" flex gap-1 px-4 w-full rounded-lg bg-dark-4">
<img src="/assets/icons/search.svg" alt="search"
width={24}
height={24}
/>
<Input
type='text'
placeholder="Search"
className="explore-search"

onChange={(e)=>setsearchValue(e.target.value)}
/>
</div>


<div className="flex-between w-full max-w-5xl mt-16 mb-7">
<h3 className="body-bold mf:h3-bold">Popular Today</h3>
<div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
<p className="small-medium md:base-medium text-light-2">All</p>
<img src="/assets/icons/filter.svg" alt="" 
width={20}
height={20}
/>
</div>
</div>
<div className="flex flex-wrap gap-9 w-full max-w-5xl">
{
  shouldShowSearchResults?<>
  
  <SearchResults  
  isSearchFetching={isSearchFetching}
                SearchPosts={SearchPosts?.documents}  
  />
  
  </>:shouldShowPost?<p></p>:<>
  {
    posts?.pages?.map((item,index)=>{
      if(item)
    return   <GridPostList key={index} posts={item?.documents}/>
    })
  }
  
  </>
}

</div>

</div>
{
  hasNextPage && !searchValue && (
    <div className="mt-10" ref={ref}>
      <Loader/>
    </div>
  )
}
   </div>
  )
}

export default Explore
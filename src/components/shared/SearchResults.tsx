import { Models } from "appwrite"
import Loader from "./Loader"
import GridPostList from "./GridPostList"


type SearchResultsprops = {
  isSearchFetching: boolean,
  SearchPosts?: Models.Document[]
}
const SearchResults = ({ isSearchFetching, SearchPosts }: SearchResultsprops) => {
  if (isSearchFetching)
    return <Loader />
  if (SearchPosts && SearchPosts.length > 0)
    return <GridPostList posts={SearchPosts} />
  return (
    <div className="text-light-4 mt-10 text-center w-full">No results Found</div>
  )
}

export default SearchResults
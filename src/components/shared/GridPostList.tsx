import { AuthContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import { useContext } from "react"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"

type GridPostList = {
  posts: Models.Document[],
  showStats?: boolean,
  showUser?: boolean

}
const GridPostList = ({ posts, showStats, showUser }: GridPostList) => {
  const { user } = useContext(AuthContext);
  console.log(posts)
  return (
    <ul className="grid-container">
      {
        posts?.map((post, index) => {
          return <>

            <li className="relative min-w-80 h-80" key={index}>

              <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img src={post.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="grid-post_user">
                {
                  showUser && <>
                    <div className="flex justify-start gap-2 items-center">
                      <img src={post.creator.imageUrl} alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="line-clamp-1">{post.creator.name}</p>
                    </div>
                  </>
                }

                {
                  showStats && <PostStats post={post} userId={user.id} />
                }

              </div>


            </li>
          </>
        })
      }
    </ul>
  )
}

export default GridPostList
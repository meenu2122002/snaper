import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
 
} from "@tanstack/react-query"
import { DeletesavedPost, createPost, createUserAccount, deletePost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserById, getUsers, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost, updateUser } from "../appwrite/api"
import { QUERY_KEYS } from "./queryKeys"
export const useGetUserById = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
  };
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (user: IUpdateUser) => updateUser(user),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
        });
      },
    });
  };
export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),

    })
}
export const useSignInAccountMutation = () => {
    return useMutation({
        mutationFn: (user: { email: string, password: string }) => signInAccount(user),

    })
}
export const useSignOutAccountMutation = () => {
    return useMutation({
        mutationFn: () => signOutAccount(),

    })
}
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
};
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}
export const useLikedPost = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[]; }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })


}
export const useSavePost = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => savePost(postId, userId),
        onSuccess: (data) => {

            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })


}
export const useDeleteSavedPost = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: ({ savedRecordId }: { savedRecordId: string }) => DeletesavedPost(savedRecordId),
        onSuccess: (data) => {

            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryclient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })


}
export const useGetCurrentUser = () => {
    return useQuery({
        queryFn: getCurrentUser,
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]

    })
}
export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
    });
};
export const useGetUpdatedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]


            })
        }

    });
};
export const useDeletedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, imageId }: { postId: string, imageId: string }) => deletePost(postId, imageId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]


            })
        }

    });
};
export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        // initialPageParam:0,
        getNextPageParam: (lastPage) => {
            // console.log(lastPage)
            if (!lastPage || lastPage.documents.length == 0)
                        return null;
             const lastId=lastPage?.documents[lastPage.documents.length-1].$id;
                return (lastId);
            
          },
        // getNextPageParam: (lastPage, pages) => {
        //     
               
        // }
       
    })
}
export const useSearchPost=(searchTerm:string)=>{
return useQuery({
    queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
    queryFn:()=>searchPosts(searchTerm),
    enabled:!!searchTerm
})
}
export const useGetUsers=(limit?:number)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USERS],
        queryFn:()=>getUsers(limit),
        
    })
}
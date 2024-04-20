import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";
export async function deleteFile(fileId: string) {
   try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);

      return { status: "ok" };
   } catch (error) {
      console.log(error);
   }
}
export function getFilePreview(fileId: string) {
   try {
      const fileUrl = storage.getFilePreview(
         appwriteConfig.storageId,
         fileId,
         2000,
         2000,
         "top",
         100
      );

      if (!fileUrl) throw Error;

      return fileUrl;
   } catch (error) {
      console.log(error);
   }
}
export async function uploadFile(file: File) {
   try {
      const uploadedFile = await storage.createFile(
         appwriteConfig.storageId,
         ID.unique(),
         file
      );

      return uploadedFile;
   } catch (error) {
      console.log(error);
   }
}

export async function createPost(post: INewPost) {
   try {
      // Upload file to appwrite storage
      console.log("post.file in create post", post?.file)
      const uploadedFile = await uploadFile(post.file[0]);
      console.log("uploaded file", uploadedFile)
      if (!uploadedFile) throw Error;

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      console.log("getFilePreview", fileUrl)
      if (!fileUrl) {
         await deleteFile(uploadedFile.$id);
         throw Error;
      }

      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
      console.log(typeof (tags), "type of tags")
      // Create post
      const newPost = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         ID.unique(),
         {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
         }
      );

      if (!newPost) {
         await deleteFile(uploadedFile.$id);
         throw Error;
      }

      return newPost;
   } catch (error) {
      console.log(error);
   }
}

export async function createUserAccount(user: INewUser) {
   try {
      const newAccount = await account.create(
         ID.unique(),
         user.email,
         user.password,
         user.name
      );
      // if (!newAccount) throw error;

      const avatarsUrl = avatars.getInitials(user.name);



      const newUser = await saveUserToDB({
         accountId: newAccount.$id,
         name: newAccount.name,
         email: newAccount.email,
         username: user.username,
         imageUrl: avatarsUrl,


      })




      return newUser;
   } catch (error) {
      // console.log(error)
      return error;
   }
}
export async function saveUserToDB(user: {
   accountId: string,
   email: string,
   name: string,
   imageUrl: URL,
   username: string,

}) {
   try {
      const newUser = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         user
      )
      return newUser;
   } catch (error) {
      console.log(error)
   }
}
export async function signInAccount(user: { email: string, password: string }) {
   try {
      const session = await account.createEmailSession(user.email, user.password);
      console.log(session)
      return session;
   } catch (error) {
      return error;
   }
}
export async function getCurrentUser() {
   const currentAccount = await account.get();
   const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
   )
   console.log(currentUser)
   if (!currentUser) throw Error
   return currentUser.documents[0];


}
export async function signOutAccount() {
   try {
      const session = await account.deleteSession('current');
      return session;
   } catch (error) {
      console.log(error)
   }
}
export async function getRecentPosts() {
   const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]

   );
   if (!posts) throw Error;
   return posts;
}
export async function likePost(postId: string, likesArray: string[]) {
   try {
      const updatedPost = await databases.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId,
         {
            likes: likesArray
         }

      );
      if (!updatedPost)
         throw Error;
      else {
         return updatedPost;
      }


   } catch (error) {
      console.log(error)
   }
}
export async function savePost(postId: string, userId: string) {
   try {
      const updatedPost = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.savesCollectionId,
         ID.unique(),
         {
            user: userId,
            post: postId
         }

      );
      if (!updatedPost)
         throw Error;
      else {
         // console.log("updated post",updatedPost)
         return updatedPost;
      }


   } catch (error) {
      console.log(error)
   }
}
export async function DeletesavedPost(saveRecordId: string) {
   try {
      console.log(saveRecordId)
      const deletedPost = await databases.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.savesCollectionId,
         saveRecordId

      );
      if (!deletedPost)
         throw Error;
      else {
         // console.log("deleted post",deletedPost)
         return deletedPost;
      }


   } catch (error) {
      console.log(error)
   }
}
export async function getPostById(postId: string) {
   try {
      const post = await databases.getDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId,

      )
      console.log(post)
      return post;
   } catch (error) {
      console.log(error)
   }
}

export async function updatePost(post: IUpdatePost) {
   try {
      const hasFileToUpload = post.file.length > 0;
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
      if (hasFileToUpload) {
         console.log("post.file in create post", post?.file)
         const uploadedFile = await uploadFile(post.file[0]);
         console.log("uploaded file", uploadedFile)
         if (!uploadedFile) throw Error;

         // Get file url
         const fileUrl = getFilePreview(uploadedFile.$id);
         console.log("getFilePreview", fileUrl)
         if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
         }

         // Convert tags into array

         console.log(typeof (tags), "type of tags")
         // Create post
         const newUpdatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {

               caption: post.caption,
               imageUrl: fileUrl,
               imageId: uploadedFile.$id,
               location: post.location,
               tags: tags,
            }
         );

         if (!newUpdatedPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
         }
         await deleteFile(post.imageId);
         return newUpdatedPost;

      }
      else {
         const newPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {

               caption: post.caption,

               location: post.location,
               tags: tags,
            }
         );

         if (!newPost) {

            throw Error;
         }

         return newPost;
      }






   } catch (error) {
      console.log(error)
   }


}
export async function deletePost(postId: string, imageId: string) {
   try {
      if (!postId || !imageId)
         throw Error;
      console.log(postId, imageId)
      const statusCode = await databases.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId
      );

      if (!statusCode) {
         console.log("error")
         throw Error;
      }


      const deletedFileStatus = await deleteFile(imageId);
      return deletedFileStatus;
   } catch (error) {
      console.log(error)
   }
}
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
   console.log(pageParam,"calling")
   const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(1)];
   if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
   }
   try {
      const Posts = await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         queries
      );
      if (!Posts)
         throw Error;
      else {
         console.log(Posts)
         return Posts;
      }



   } catch (error) {
      console.log(error)
   }
}
export async function searchPosts(searchTerm: string) {

   try {
      const Posts = await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         [
            Query.search('caption', searchTerm)
         ]
      );
      if (!Posts)
         throw Error;
      else {
         return Posts;
      }



   } catch (error) {
      console.log(error)
   }
}
export async function getUsers(limit?: number) {
   try {
      const queries: any[] = [Query.orderDesc("$createdAt")];

      if (limit) {
         queries.push(Query.limit(limit));
      }
      const Users = await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         queries
      );
      if (!Users)
         throw Error;
      else {
         return Users;
      }



   } catch (error) {
      console.log(error)
   }
}
export async function updateUser(user: IUpdateUser) {
   const hasFileToUpdate = user.file.length > 0;
   try {
      let image = {
         imageUrl: user.imageUrl,
         imageId: user.imageId,
      };

      if (hasFileToUpdate) {
         // Upload new file to appwrite storage
         const uploadedFile = await uploadFile(user.file[0]);
         if (!uploadedFile) throw Error;

         // Get new file url
         const fileUrl = getFilePreview(uploadedFile.$id);
         if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
         }

         image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }

      //  Update user
      const updatedUser = await databases.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         user.userId,
         {
            name: user.name,
            bio: user.bio,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
         }
      );

      // Failed to update
      if (!updatedUser) {
         // Delete new file that has been recently uploaded
         if (hasFileToUpdate) {
            await deleteFile(image.imageId);
         }
         // If no new file uploaded, just throw error
         throw Error;
      }

      // Safely delete old file after successful update
      if (user.imageId && hasFileToUpdate) {
         await deleteFile(user.imageId);
      }

      return updatedUser;
   } catch (error) {
      console.log(error);
   }
}
export async function getUserById(userId: string) {
   try {
     const user = await databases.getDocument(
       appwriteConfig.databaseId,
       appwriteConfig.userCollectionId,
       userId
     );
 
     if (!user) throw Error;
 
     return user;
   } catch (error) {
     console.log(error);
   }
 }
 
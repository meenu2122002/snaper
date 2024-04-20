import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/context/AuthContext"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import FileUploader from "../shared/FileUploader"
import { Models } from "appwrite"
import { useCreatePost, useGetUpdatedPost } from "@/lib/tanstackreact-query/queriesAndMutations"
import { toast } from "../ui/use-toast"



const formSchema = z.object({
  location: z.string().min(2).max(2200),
  tags: z.string(),
  file: z.custom<File[]>(),
  caption: z.string().min(2).max(100),

})

type PostFormProps = {
  post?: Models.Document,
  action: "Create" | "Update"
}
const PostForms = ({ post, action }: PostFormProps) => {
  console.log(post)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const { mutateAsync: createPost, isPending: postCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: postUpdating } = useGetUpdatedPost();
  // const { mutateAsync: createPost, isPending: postCreated } = useCreatePost();




  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: post ? post.caption : "",
      location: post ? post.location : "",
      tags: post ? post.tags.join(',') : '',
      file: []
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (post && action === "Update") {
      const newPost = await updatePost({

        postId: post.$id,
        ...values,
        imageId: post.imageId


      })
      if (!newPost) {
        toast({
          title: "Please try again",

        })


      }
      else {
     return    navigate(`/posts/${post.$id}`)
      }
    }
    else {
      const newPost = await createPost({
        ...values,
        userId: user.id
      })
      if (!newPost) {
        toast({
          title: "Please try again",

        })


      }
      else {
        navigate("/")
      }

    }



    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full ">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea  {...field} className=" shad-textarea custom-scrollbar" />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>

                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add location</FormLabel>
              <FormControl>
                <Input  {...field} className=" shad-input " type="text" />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}

        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add tags(separated by comma " , ")</FormLabel>
              <FormControl>
                <Input  {...field} className=" shad-input " type="text" placeholder="NodeJS ,DJANGO,FLASK" />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}

        />
        <div className="flex  gap-4 items-center justify-end">

          <Button className="shad-button_dark_4" type="submit" id="cancel">Cancel</Button>
          <Button type="submit"
            className=" shad-button_primary whitespace-nowrap"
            disabled={postCreating || postUpdating}
            id="submit"
          >{
          
          (postCreating || postUpdating ) ? 'Loading...':action+" "
          }
          Post
          </Button>
        </div>
      </form>
    </Form>)
}

export default PostForms
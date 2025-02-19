"use client";

import { deletePost } from "@/actions/post/delete-post";
import { GetPostsResponse } from "@/actions/post/get-posts";
import CustomAlert from "@/components/CustomAlert";
import Loading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Toast } from "@/lib/Toast";
import { cn, formatDateString } from "@/lib/utils";
import { Eye, NotebookPen, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Editor = ({
  components,
  PostsData,
  isLoading,
  cardMode,
  refetch,
}: {
  components?: any;
  PostsData?: GetPostsResponse;
  isLoading?: boolean;
  cardMode?: boolean;
  refetch?: () => void;
}) => {
  const router = useRouter();

  async function handleDeletePost(id: string) {
    const formData = new FormData();
    formData.append("id", id);
    await deletePost({}, formData).then((res) => {
      if (res.errors) {
        Toast.error(res?.message || "Something went wrong");
      } else {
        Toast.success(res?.message);
        refetch && refetch();
      }
    });
  }

  function handleUpdatePost(_id: string, postSlug: string) {
    router.push(`/editor?type=UPDATE&postId=${_id}&postSlug=${postSlug}`);
  }

  return (
    <div className="bg-neutral-300 w-full h-screen flex flex-col">
      <div className="bg-neutral-900 px-10 text-white p-2 h-[60px] flex items-center">
        <h1 className="text-3xl">Manage Posts</h1>
      </div>
      {components}
      {isLoading && <Loading />}
      <div
        className={cn(
          "flex gap-4 p-5 overflow-y-auto hide_scrollbar max-w-[1280px]",
          {
            "mx-auto flex-wrap": cardMode,
            "flex-col": !cardMode,
          }
        )}
      >
        {(PostsData?.data || [])?.map((post, idx) => {
          if (!cardMode) {
            return (
              <div
                key={idx}
                className="min-h-[150px] h-[150px] max-h-[150px] hover:bg-slate-200 bg-white overflow-hidden cursor-pointer border-[1px] rounded-sm hover:shadow-md gap-3 flex items-center justify-start"
              >
                <div className="relative min-w-[200px] h-[150px] bg-black">
                  {post.thumbnail && (
                    <Image
                      src={post.thumbnail}
                      fill
                      alt="thumbnail"
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="relative flex gap-1 text-black flex-col">
                  <h2
                    className="hover:underline text-xs flex items-center justify-start gap-2"
                    onClick={() => router.push(`/post/${post?.slug}`)}
                  >
                    <span className="flex items-center gap-1">
                      <Eye className="w-5 h-5" />
                      <span>View</span>
                    </span>
                    <span className="text-blue-700 font-semibold">
                      {`/post/${post?.slug}`}
                    </span>
                  </h2>
                  <h2 className="text-md font-semibold">{post?.title}</h2>
                  <p className="text-xs line-clamp-2">{post?.description}</p>
                  <div className="flex items-center font-semibold gap-3">
                    <span className="w-fit text-xs">
                      Views: {post?.views || "No Views"}
                    </span>
                    <span className="w-fit text-xs">
                      Created At: {formatDateString(post?.createdAt)}
                    </span>
                    <span className="w-fit text-xs">
                      Updated At: {formatDateString(post?.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="ml-auto flex flex-col bg-black h-full p-4 items-center gap-4 justify-center">
                  <NotebookPen
                    onClick={() => handleUpdatePost(post?.id, post?.slug)}
                    className="w-10 h-10 text-white hover:scale-125"
                  />
                  <CustomAlert
                    variant="confirmation"
                    onConfirm={() => handleDeletePost(post?.id)}
                    trigger={
                      <Trash className="w-10 h-10 text-white hover:scale-125 hover:text-red-500" />
                    }
                  />
                </div>
              </div>
            );
          }
          return (
            <Card
              key={idx}
              className="relative transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer w-[400px] h-[400px] flex flex-col border-none bg-neutral-800 rounded-none"
            >
              <div className="relative w-full h-[300px] bg-black">
                {post.thumbnail && (
                  <Image
                    src={post.thumbnail}
                    fill
                    alt="thumbnail"
                    className="object-contain"
                  />
                )}
                <span className="absolute bottom-2 text-xs flex gap-2 justify-center w-full items-center text-white">
                  <span className="flex items-center">
                    Created: {formatDateString(post?.createdAt)}
                  </span>
                  <span className="flex items-center">
                    Updated:
                    {formatDateString(post?.updatedAt)}
                  </span>
                </span>
              </div>
              <span className="absolute top-3 right-3 text-white w-fit font-normal text-xs">
                Views: {post?.views || "No Views"}
              </span>
              <div className="p-2 text-white px-4">
                <h1 className="line-clamp-1 text-lg">{post?.title}</h1>
                <p className="line-clamp-2 text-xs mt-1">{post?.description}</p>
              </div>
              <div className="z-50 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 w-full h-full bg-[#000000a1] absolute left-0 top-0">
                <NotebookPen
                  onClick={() => handleUpdatePost(post?.id, post?.slug)}
                  className="w-10 h-10 text-white hover:scale-125"
                />
                <CustomAlert
                  variant="confirmation"
                  onConfirm={() => handleDeletePost(post?.id)}
                  trigger={
                    <Trash className="w-10 h-10 text-white hover:scale-125 hover:text-red-500" />
                  }
                />
              </div>
              <Checkbox className="z-50 absolute top-2 left-2 bg-neutral-600 data-[state=checked]:bg-purple-700" />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Editor;

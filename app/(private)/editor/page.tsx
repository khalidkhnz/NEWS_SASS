"use client";

import Preview from "@/components/news/Preview";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Delta } from "quill";
import { useState } from "react";
import { useFormik } from "formik";
import { createPost } from "@/actions/post/create-post";
import { Toast } from "@/lib/Toast";
import CustomInput from "@/components/CustomInput";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions/category/get-categories";
import { Badge } from "@/components/ui/badge";
import { cn, safeJSONparse } from "@/lib/utils";
import Loading from "@/components/loading";
import Image from "next/image";
import { useExtendedEffect } from "@/hooks/useExtendedEffect";
import { getPostBySlug } from "@/queries/posts-queries";
import { updatePost } from "@/actions/post/update-post";

const dummyImageURL =
  "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";

const QuillEditor = dynamic(() => import("@/components/news/QuillEditor"));

type EditorType = "CREATE" | "UPDATE";

function validate(vals: ReturnType<typeof getInitialVals>) {
  return Object.keys(vals).some((key) => {
    if (key === "delta") return false;
    const curr = vals[key as keyof typeof vals];
    if (Array.isArray(curr)) {
      return curr.length === 0;
    } else {
      return !curr;
    }
  });
}

function getInitialVals(prefill?: Awaited<ReturnType<typeof getPostBySlug>>) {
  const initialValues = {
    title: prefill?.title || "",
    description: prefill?.description || "",
    thumbnail: prefill?.thumbnail || "",
    delta: safeJSONparse(prefill?.delta || "") || "",
    tags: (safeJSONparse(prefill?.tags || "") || []) as string[],
    categories: (safeJSONparse(prefill?.categories || "") || []) as string[],
  };
  return initialValues;
}

export default function Home() {
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postId") || "";
  const postSlug = searchParams?.get("postSlug") || "";
  const type: EditorType = searchParams?.get("type") as EditorType;
  const router = useRouter();
  const [delta, setDelta] = useState<Delta | undefined>();

  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [tagState, setTagState] = useState("");

  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const fk = useFormik({
    initialValues: getInitialVals(),
    async onSubmit(values) {
      const formData = new FormData();
      if (type === "UPDATE") {
        formData.append("id", decodeURIComponent(postId));
      }
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("thumbnail", values.thumbnail);
      formData.append("delta", values.delta);
      formData.append("subTitle", values.title?.slice(0, 20));
      formData.append("tags", JSON.stringify(values.tags));
      formData.append("categories", JSON.stringify(values.categories));
      formData.append(
        "slug",
        `${values.title
          ?.slice(0, 40)
          ?.split(" ")
          .join("-")}-${Date.now().toString()}`
      );
      const response =
        type === "UPDATE"
          ? await updatePost({}, formData)
          : await createPost({}, formData);
      if (response?.errors) {
        Toast.error("Something went wrong");
      } else {
        Toast.success(response?.message);
        router.push("/posts");
      }
    },
  });

  useExtendedEffect({
    exec(finish) {
      if (postId) {
        (async () => {
          const res = await getPostBySlug(decodeURIComponent(postSlug));
          setDelta(safeJSONparse(res?.delta || ""));
          setThumbnailPreview(res?.thumbnail || "");
          fk.setValues(getInitialVals(res));
        })();
        finish();
      }
    },
    dependencies: [postSlug],
  });

  async function uploadImageAndReplaceWithURL(delta: Delta) {
    const updatedOps = await Promise.all(
      delta.ops.map(async (op: any, idx) => {
        if (op.insert?.image) {
          console.log("INDEX: ", idx);
          console.log(op.insert?.image);
          // Simulate an image upload and URL replacement
          const newImageUrl = dummyImageURL;
          return {
            ...op,
            insert: {
              ...op.insert,
              image: newImageUrl,
            },
          };
        }
        return op;
      })
    );

    const newDelta = new Delta(updatedOps);
    setDelta(newDelta);
    return newDelta;
  }

  async function handleSave(deltaVal: Delta) {
    const newDelta = await uploadImageAndReplaceWithURL(deltaVal);
    fk.setFieldValue("delta", JSON.stringify(newDelta));
    fk.handleSubmit();
  }

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery(
    {
      queryKey: [`categories-${categorySearchTerm}`],
      queryFn: () =>
        getCategories({
          limit: 100,
          search: categorySearchTerm,
        }),
    }
  );

  return (
    <div className="max-h-screen px-4 w-full overflow-y-auto">
      <div className="p-2">
        <h1 className="text-2xl font-semibold">
          {type === "CREATE" ? `Create Post` : `Update Post - ${postId}`}
        </h1>
      </div>
      <div className="p-2 w-full gap-2 flex-col flex flex-wrap">
        <div className="flex gap-4">
          <div
            className={cn(
              "relative flex items-center justify-center rounded-md min-w-[280px] min-h-[280px]",
              {
                "border-[1px] border-black": !thumbnailPreview,
              }
            )}
          >
            {thumbnailPreview ? (
              <Image
                className="object-contain"
                src={thumbnailPreview}
                alt="thumbnailPreview"
                fill
              />
            ) : (
              <span>Add Thumbnail</span>
            )}

            <Input
              className="absolute opacity-0 max-w-[300px] bg-red-400 w-full h-full"
              type="file"
              name="thumbnail"
              onChange={(e) => {
                const file = Array.from(e.target.files || [])?.[0];
                if (file) {
                  setThumbnailPreview(URL.createObjectURL(file));
                  fk.setFieldValue("thumbnail", dummyImageURL);
                }
              }}
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <span className="text-sm pl-2 font-semibold">Title</span>
            <Input
              value={fk.values.title}
              onChange={fk.handleChange}
              onBlur={fk.handleBlur}
              name="title"
              className="border-[1px] border-black/20"
              placeholder="Post Heading"
            />
            <span className="text-sm pl-2 mt-4 font-semibold">Description</span>
            <Textarea
              value={fk.values.description}
              onChange={fk.handleChange}
              onBlur={fk.handleBlur}
              name="description"
              className="border-[1px] border-black/20"
              placeholder="Description"
            />
          </div>
        </div>
        <section>
          <div className="flex flex-col mx-auto max-w-[450px] gap-2 items-center justify-center mt-6">
            <Label>Search And Attach Category</Label>
            <CustomInput
              value={categorySearchTerm}
              onChange={(e) => setCategorySearchTerm(e.target.value)}
              placeholder="Search Category"
              className="max-w-[450px] border-[1px] border-black"
            />
          </div>
          <div className="flex flex-wrap gap-2 p-4 mt-4">
            {isCategoriesLoading ? (
              <Loading className="h-[200px]" />
            ) : (
              categoriesResponse?.data?.map((category, idx) => {
                const isActive = fk.values.categories.includes(
                  category?.category
                );
                return (
                  <Badge
                    key={category?.id}
                    onClick={() => {
                      if (isActive) {
                        fk.setFieldValue(
                          "categories",
                          fk.values?.categories?.filter(
                            (c) => c !== category?.category
                          )
                        );
                      } else {
                        fk.setFieldValue("categories", [
                          ...fk.values?.categories,
                          category?.category,
                        ]);
                      }
                    }}
                    className={cn(
                      "font-normal px-2 py-1 hover:text-white cursor-pointer",
                      {
                        "bg-white text-black": !isActive,
                      }
                    )}
                  >
                    {category?.category}
                  </Badge>
                );
              })
            )}
          </div>
          <div className="flex flex-col mx-auto max-w-[450px] gap-2 items-center justify-center mt-6">
            <Label>Add Tags</Label>
            <CustomInput
              value={tagState}
              onChange={(e) => setTagState(e.target.value)}
              onKeyDown={(e) => {
                const currTag = tagState.trim();
                if (e.key === "Enter" && currTag) {
                  fk.setFieldValue("tags", [...fk.values.tags, currTag]).then(
                    () => setTagState("")
                  );
                }
              }}
              placeholder="Type and enter tags"
              className="max-w-[450px] border-[1px] border-black"
            />
          </div>
          <div className="flex flex-wrap gap-2 p-4 mt-4">
            {fk.values?.tags?.map((tag, idx) => {
              return (
                <Badge
                  key={`${tag}-${idx}`}
                  onClick={() => {
                    fk.setFieldValue(
                      "tags",
                      fk.values?.tags?.filter((t) => t !== tag)
                    );
                  }}
                  className={cn(
                    "font-normal px-2 py-1 hover:text-white cursor-pointer hover:bg-red-600"
                  )}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </section>
      </div>
      <QuillEditor
        initialDelta={delta}
        onPreview={(deltaVal) => setDelta(deltaVal)}
        onSave={handleSave}
        disableSave={validate(fk.values)}
      />
      {delta && (
        <div className="w-full max-w-[700px] mx-auto">
          <h1 className="p-4 text-xl w-full text-center">PREVIEW</h1>
          <Preview delta={delta} />
        </div>
      )}
    </div>
  );
}

"use client";

import Preview from "@/components/news/Preview";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Delta } from "quill";
import React, { Fragment, JSX, useState } from "react";
import { FormikProps, useFormik } from "formik";
import { createPost } from "@/actions/post/create-post";
import { Toast } from "@/lib/Toast";
import CustomInput from "@/components/CustomInput";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions/category/get-categories";
import { Badge } from "@/components/ui/badge";
import {
  cn,
  formatDateString,
  handleClickElementById,
  safeJSONparse,
} from "@/lib/utils";
import Loading from "@/components/loading";
import Image from "next/image";
import { useExtendedEffect } from "@/hooks/useExtendedEffect";
import { getPostBySlug } from "@/queries/posts-queries";
import { updatePost } from "@/actions/post/update-post";
import { parseQuillDelta } from "quilljs-parser";
import Header from "@/components/news/Header";
import SideCategoryBar from "@/components/news/SideCategoryBar";
import FeaturedSection from "@/components/news/FeaturedSection";
import SideCategoryBar2 from "@/components/news/SideCategoryBar2";
import Footer from "@/components/news/Footer";
import Sidebar from "@/components/news/Sidebar";
import CustomButton from "@/components/CustomButton";

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
    categories: (prefill?.categories || []) as string[],
  };
  return initialValues;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const postId = searchParams?.get("postId") || "";
  const postSlug = searchParams?.get("postSlug") || "";
  const type: EditorType = searchParams?.get("type") as EditorType;

  const [existingPostData, setExistingPostData] =
    useState<Awaited<ReturnType<typeof getPostBySlug>>>(null);

  const [delta, setDelta] = useState<Delta | undefined>();

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
      const parsedDelta = parseQuillDelta(delta as Delta);
      formData.append("parsedDelta", JSON.stringify(parsedDelta));
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
          setExistingPostData(res);
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

  return (
    <div className="max-h-screen w-full overflow-y-auto">
      <div className="flex gap-3 items-center justify-center sticky p-2 top-0 left-0 w-full z-[9999999] bg-[#262626]">
        <CustomButton
          variant={"link"}
          className="w-[130px] text-white font-normal"
          onClick={handleClickElementById("handle_preview_post")}
        >
          LOG CONTENT
        </CustomButton>
        <CustomButton
          className="w-[130px] border-[1px] font-normal"
          onClick={handleClickElementById("handle_preview_post")}
        >
          PREVIEW
        </CustomButton>
        <CustomButton
          gradient={!validate(fk.values)}
          disabled={validate(fk.values)}
          className="w-[130px] font-normal"
          onClick={handleClickElementById("handle_save_post")}
        >
          SAVE
        </CustomButton>
      </div>
      <section className="px-4">
        <div className="flex font-normal justify-between items-center p-2 py-4 mb-4 mt-2 border-[1px] text-white bg-[#001F29] border-[#001F29] px-4 rounded-md">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl">
              {type === "CREATE" ? `CREATE POST` : `UPDATE POST - ID ${postId}`}
            </h1>
            {existingPostData && (
              <div className="text-sm">
                Created At: {formatDateString(existingPostData?.createdAt)}
              </div>
            )}
          </div>
          {existingPostData && (
            <div className="text-md flex flex-col gap-1">
              <div>Author: {existingPostData?.author}</div>
              <div>Views: {existingPostData?.views}</div>
            </div>
          )}
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
              <span className="text-sm pl-2 mt-4 font-semibold">
                Description
              </span>
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
            <AttachCategories fk={fk} />
            <AttachTags fk={fk} />
          </section>
        </div>
        <PreviewLayout
          id="editor"
          className="border-[1px] shadow-md border-neutral-600"
          heading={
            <div className="w-full flex justify-center gap-4">
              <span className="text-[40px]">WRITE HERE</span>
            </div>
          }
          title=""
          disableFeaturedSection
          disableHeader
          disableFooter
          child={
            <QuillEditor
              initialDelta={delta}
              onPreview={(deltaVal) => {
                setDelta(deltaVal);
                router.push("#preview");
              }}
              onSave={handleSave}
              disableSave={validate(fk.values)}
            />
          }
        />
        <PreviewLayout
          id="preview"
          className="border-[1px] shadow-md border-neutral-600"
          heading={
            <div className="w-full flex justify-between gap-4">
              <span className="text-[32px]">PREVIEW</span>
              <CustomButton
                className="w-[100px] h-[35px] font-normal"
                onClick={() => router.push("#editor")}
              >
                Edit
              </CustomButton>
            </div>
          }
          title={fk.values?.title}
          description={fk.values?.description}
          child={delta && <Preview delta={delta} />}
          onError={<div>Error while generating preview</div>}
        />
      </section>
    </div>
  );
}

function PreviewLayout({
  id,
  child,
  onError,
  title,
  description,
  heading,
  className,
  disableHeader,
  disableFeaturedSection,
  disableLeftSidebar,
  disableRightSidebar,
  disableFooter,
}: {
  id?: string;
  child?: any;
  onError?: any;
  className?: string;
  title?: string;
  heading?: string | JSX.Element;
  description?: string;
  disableHeader?: boolean;
  disableLeftSidebar?: boolean;
  disableRightSidebar?: boolean;
  disableFeaturedSection?: boolean;
  disableFooter?: boolean;
}) {
  try {
    return (
      <div
        id={id}
        className={cn("w-full mx-auto mt-8 px-2 rounded-md", className)}
      >
        <h1 className="p-4 text-2xl font-bold my-4 w-full text-center">
          {heading}
        </h1>
        <Sidebar>
          <main className="bg-neutral-200 pt-2">
            {!disableHeader && <Header />}
            <div className="flex gap-2 max-w-[1800px] justify-center mx-auto">
              {!disableLeftSidebar && <SideCategoryBar position="left" />}
              <div className="md:min-w-[600px] w-full max-w-[700px] shadow-md">
                <div className="bg-white p-2 pt-6">
                  <h1 className="text-2xl font-bold text-neutral-600 pb-2">
                    {title}
                  </h1>
                  <p className="line-clamp-2 font-normal text-xs text-neutral-800 mb-8">
                    {description}
                  </p>
                  {child && child}
                </div>
                {!disableFeaturedSection && <FeaturedSection />}
              </div>
              {!disableRightSidebar && <SideCategoryBar2 position="right" />}
            </div>
            {!disableFooter && <Footer />}
          </main>
        </Sidebar>
      </div>
    );
  } catch (error) {
    return <Fragment>{onError ? onError : <div>Error</div>}</Fragment>;
  }
}

function AttachCategories({
  fk,
}: {
  fk: FormikProps<ReturnType<typeof getInitialVals>>;
}) {
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

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
    <section className="border-[1px] rounded-md shadow-md border-neutral-600">
      <div className="flex flex-col mx-auto max-w-[450px] gap-2 items-center justify-center mt-6">
        <Label className="text-2xl mb-4">Search And Attach Category</Label>
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
            const isActive = fk.values.categories.includes(category?.category);
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
    </section>
  );
}

function AttachTags({
  fk,
}: {
  fk: FormikProps<ReturnType<typeof getInitialVals>>;
}) {
  const [tagState, setTagState] = useState("");

  return (
    <section className="border-[1px] rounded-md shadow-md border-neutral-600 mt-6">
      <div className="flex flex-col mx-auto max-w-[500px] gap-2 items-center justify-center mt-6">
        <Label className="text-2xl mb-4">Add Tags</Label>
        <div className="flex items-center gap-2 w-full">
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
          <CustomButton
            onClick={() => {
              const currTag = tagState.trim();
              if (currTag) {
                fk.setFieldValue("tags", [...fk.values.tags, currTag]).then(
                  () => setTagState("")
                );
              }
            }}
            className="w-[100px] font-normal"
          >
            Add
          </CustomButton>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 p-4 mt-4">
        {fk.values?.tags?.length == 0 && (
          <div className="text-xl mx-auto text-red-500 my-4">
            Please Add At Least 1 Tag
          </div>
        )}
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
  );
}

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

const QuillEditor = dynamic(() => import("@/components/news/QuillEditor"));

type EditorType = "CREATE" | "UPDATE";

export default function Home() {
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postId");
  const type: EditorType = searchParams?.get("type") as EditorType;
  const router = useRouter();
  const [delta, setDelta] = useState<Delta | undefined>();

  const fk = useFormik({
    initialValues: {
      title: "",
      description: "",
      thumbnail: "",
      delta: "",
    },
    async onSubmit(values) {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("thumbnail", values.thumbnail);
      formData.append("delta", values.delta);
      formData.append("subTitle", values.title?.slice(0, 20));
      formData.append("tags", JSON.stringify(["TAGS", "KHABIB"]));
      formData.append("categories", JSON.stringify(["SPORTS", "CATEGORIES"]));
      formData.append(
        "slug",
        `${values.title
          ?.slice(0, 20)
          ?.split(" ")
          .join("-")}-${Date.now().toString()}`
      );
      const response = await createPost({}, formData);
      if (response?.errors) {
        Toast.error("Something went wrong");
      } else {
        Toast.success(response?.message);
        router.push("/posts");
      }
    },
  });

  async function uploadImageAndReplaceWithURL(delta: Delta) {
    const updatedOps = await Promise.all(
      delta.ops.map(async (op: any, idx) => {
        if (op.insert?.image) {
          console.log("INDEX: ", idx);
          console.log(op.insert?.image);
          // Simulate an image upload and URL replacement
          const newImageUrl =
            "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";
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
    <div className="max-h-screen px-4 overflow-y-auto">
      <div className="p-2">
        <h1 className="text-2xl font-semibold">
          {type === "CREATE" ? `Create Post` : `Update Post - ${postId}`}
        </h1>
      </div>
      <div className="p-2 w-full gap-2 flex-col flex flex-wrap">
        <Input
          value={fk.values.title}
          onChange={fk.handleChange}
          onBlur={fk.handleBlur}
          name="title"
          placeholder="Post Heading"
        />
        <Input
          value={fk.values.thumbnail}
          onChange={fk.handleChange}
          onBlur={fk.handleBlur}
          name="thumbnail"
          placeholder="Thumbnail URL"
        />
        <Textarea
          value={fk.values.description}
          onChange={fk.handleChange}
          onBlur={fk.handleBlur}
          name="description"
          placeholder="Description"
        />
      </div>
      <QuillEditor
        initialDelta={delta}
        onPreview={(deltaVal) => setDelta(deltaVal)}
        onSave={handleSave}
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

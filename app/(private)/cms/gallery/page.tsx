"use client";

import { uploadImage } from "@/lib/aws";
import React from "react";

const Page = () => {
  return (
    <div className="p-2 w-full bg-neutral-700 text-white">
      <input
        type="file"
        onChange={async (e) => {
          if (e.target.files) {
            const arr = Array.from(e.target.files);
            if (arr.length) {
              const file = arr[0];
              const formData = new FormData();
              formData.append("filename", "news-sass");
              formData.append("filetype", file.type);
              formData.append("file", file);
              console.log(await uploadImage(formData));
            }
          }
        }}
      />
    </div>
  );
};

export default Page;

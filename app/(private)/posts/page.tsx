"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { getPosts } from "@/actions/post/get-posts";
import CustomButton from "@/components/CustomButton";
import { useQuery } from "@tanstack/react-query";
import CustomInput from "@/components/CustomInput";
import { ArrowLeft, ArrowRight, NotebookPen, Trash, View } from "lucide-react";

const EditorComponent = dynamic(() => import("./Editor"), { ssr: false });

function Page() {
  const router = useRouter();
  const [cardMode, setCardMode] = useState(false);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search");

  const nav = [
    {
      label: "Switch View",
      onClick: () => setCardMode((p) => !p),
    },
    {
      label: "Add Post",
      onClick: () => router.push("/editor?type=CREATE"),
    },
  ];

  const {
    data: PostsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`posts-${page}-${search}`],
    queryFn: () =>
      getPosts({
        limit: 10,
        page: page,
        search: search || "",
      }),
  });

  const TOTAL_PAGES = PostsData?.totalPages;
  const CURRENT_PAGE = PostsData?.currentPage;

  return (
    <EditorComponent
      refetch={refetch}
      PostsData={PostsData}
      cardMode={cardMode}
      isLoading={isLoading}
      components={
        <React.Fragment>
          <div className="flex gap-2 justify-end items-center bg-neutral-300 px-4 text-white p-2 h-[70px]">
            {nav.map((navItem, idx) => (
              <CustomButton
                gradient={idx == 1}
                className="w-[120px] min-w-[120px] max-w-[120px] h-[40px] text-md"
                key={idx}
                onClick={navItem.onClick}
              >
                <span className="font-normal"> {navItem.label}</span>
              </CustomButton>
            ))}
          </div>
          <div className="flex pl-5 justify-start items-center gap-2 bg-black p-2 text-white">
            <CustomInput
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-[300px]"
              placeholder="Search"
            />
            <div className="flex gap-3 flex-nowrap items-center mr-4">
              {CURRENT_PAGE && CURRENT_PAGE && page > 1 && (
                <ArrowLeft
                  onClick={() => setPage((p) => p - 1)}
                  className="cursor-pointer"
                />
              )}
              <span className="text-nowrap">
                Page {CURRENT_PAGE} of {TOTAL_PAGES}
              </span>
              {TOTAL_PAGES && page < TOTAL_PAGES && (
                <ArrowRight
                  onClick={() => setPage((p) => p + 1)}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        </React.Fragment>
      }
    />
  );
}

export default Page;

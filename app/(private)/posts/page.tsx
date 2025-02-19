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
import { CustomPagination } from "@/components/CustomPagination";
import useDebounce from "@/hooks/useDebounce";

const EditorComponent = dynamic(() => import("./Editor"), { ssr: false });

function Page() {
  const router = useRouter();
  const [cardMode, setCardMode] = useState(false);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search");
  const debouncedSearchTerm = useDebounce(search, 800);

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
    queryKey: [`posts-${page}-${debouncedSearchTerm}`],
    queryFn: () =>
      getPosts({
        limit: 10,
        page: page,
        search: debouncedSearchTerm || "",
        withAuthor: true,
      }),
  });

  const TOTAL_PAGES = PostsData?.totalPages || 1;
  const CURRENT_PAGE = PostsData?.currentPage || 1;

  return (
    <EditorComponent
      refetch={refetch}
      PostsData={PostsData}
      cardMode={cardMode}
      isLoading={isLoading}
      components={
        <React.Fragment>
          <div className="flex gap-2 justify-end items-center bg-[#262626] px-4 text-white p-2 min-h-[70px] max-h-[70px] h-[70px]">
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
              <CustomPagination
                currentPage={CURRENT_PAGE}
                itemSize={TOTAL_PAGES}
                setPage={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        </React.Fragment>
      }
    />
  );
}

export default Page;

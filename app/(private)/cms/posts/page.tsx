"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState, parseAsString } from "nuqs";
import { useState } from "react";
import { getPosts } from "@/actions/post/get-posts";
import CustomButton from "@/components/CustomButton";
import { useQuery } from "@tanstack/react-query";
import CustomInput from "@/components/CustomInput";
import { CustomPagination } from "@/components/CustomPagination";
import useDebounce from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import { IPostPlatforms, IPostStatus } from "@/types/post";
import { cn } from "@/lib/utils";

const EditorComponent = dynamic(() => import("./Editor"), { ssr: false });

function Page() {
  const router = useRouter();
  const [cardMode, setCardMode] = useState(false);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search");
  const [activeStatus, setActiveStatus] = useQueryState("status");
  const [activePlatform, setActivePlatform] = useQueryState(
    "platform",
    parseAsString.withDefault("NEWS")
  );
  const debouncedSearchTerm = useDebounce(search, 800);

  const nav = [
    {
      label: "Switch View",
      onClick: () => setCardMode((p) => !p),
    },
    {
      label: "Add Post",
      onClick: () => router.push(`/cms/editor?type=CREATE`),
    },
  ];

  const {
    data: PostsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      `posts-${page}-${debouncedSearchTerm}-${activeStatus}-${activePlatform}`,
    ],
    queryFn: () =>
      getPosts({
        limit: 15,
        page: page,
        status: (activeStatus as IPostStatus) || null,
        platform: (activePlatform as IPostPlatforms) || null,
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
          <div className="flex gap-2 justify-end items-center bg-[#262626] px-5 text-white p-2 min-h-[70px] max-h-[70px] h-[70px]">
            <div className="flex items-center gap-2 mr-auto">
              <CustomInput
                parentClassName="max-w-[300px] w-[300px]"
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Start Typing To Search Post..."
              />
            </div>

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
            <div className="flex gap-2">
              {(["", "DRAFT", "PUBLISHED"] as IPostStatus[]).map((status) => {
                return (
                  <Badge
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={cn(
                      "hover:bg-[#7215a8] hover:text-white capitalize bg-white text-black rounded-md p-2 w-[90px] flex items-center justify-center cursor-pointer",
                      {
                        "text-white bg-[#7E22CE] shadow-md":
                          activeStatus == status || (!activeStatus && !status),
                      }
                    )}
                  >
                    {status ? status.toLowerCase() : "All"}
                  </Badge>
                );
              })}
            </div>
            <div className="flex gap-2 mx-auto">
              {(["NEWS", "BLOG"] as IPostPlatforms[]).map((platform) => {
                return (
                  <Badge
                    key={platform}
                    onClick={() => setActivePlatform(platform)}
                    className={cn(
                      "hover:bg-[#7215a8] hover:text-white capitalize bg-white text-black rounded-md p-2 w-[90px] flex items-center justify-center cursor-pointer",
                      {
                        "text-white bg-[#7E22CE] shadow-md":
                          activePlatform == platform ||
                          (!activePlatform && !platform),
                      }
                    )}
                  >
                    {platform.toLowerCase()}
                  </Badge>
                );
              })}
            </div>
            <div className="flex ml-auto gap-3 flex-nowrap items-center mr-4">
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

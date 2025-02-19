import React from "react";
import FeaturedPost from "./FeaturedPost";
import Headings from "./Headings";
import { GetPostsResponse } from "@/actions/post/get-posts";

const FeaturedSection = ({
  LatestPosts,
  TopViewedPosts,
}: {
  LatestPosts?: GetPostsResponse;
  TopViewedPosts?: GetPostsResponse;
}) => {
  return (
    <section className="bg-white border-t-[2px] p-2">
      <Headings className="mb-4">Featured Posts</Headings>
      <FeaturedPost posts={TopViewedPosts} type="LARGE" />
      <Headings className="mb-4">Featured Stories</Headings>
      <FeaturedPost posts={LatestPosts} type="SMALL" />
    </section>
  );
};

export default FeaturedSection;

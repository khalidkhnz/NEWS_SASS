import React from "react";
import FeaturedPost from "./FeaturedPost";
import Headings from "./Headings";

const FeaturedSection = () => {
  return (
    <section className="bg-white border-t-[2px] p-2">
      <Headings className="mb-4">Featured Posts</Headings>
      <FeaturedPost type="LARGE" />
      <Headings className="mb-4">Featured Stories</Headings>
      <FeaturedPost type="SMALL" />
    </section>
  );
};

export default FeaturedSection;

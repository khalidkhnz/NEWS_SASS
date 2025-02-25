import Header from "@/components/news/Header";
import Footer from "@/components/news/Footer";
import SideCategoryBar from "@/components/news/SideCategoryBar";
import FeaturedSection from "@/components/news/FeaturedSection";
import SideCategoryBar2 from "@/components/news/SideCategoryBar2";
import Sidebar from "@/components/news/Sidebar";
import { getPosts } from "@/actions/post/get-posts";
import { getCategories } from "@/actions/category/get-categories";

const getCachedCategories = () => {
  return getCategories({ limit: 100, page: 1, sortKey: "createdAt" });
};

const getCachedTopViewedPosts = () => {
  return getPosts({
    limit: 20,
    page: 1,
    sortKey: "views",
    status: "PUBLISHED",
  });
};

const getCachedLatestPosts = () => {
  return getPosts({
    limit: 20,
    page: 1,
    sortKey: "createdAt",
    status: "PUBLISHED",
  });
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const TopViewedPosts = await getCachedTopViewedPosts();
  const LatestPosts = await getCachedLatestPosts();
  const Categories = await getCachedCategories();

  return (
    <Sidebar>
      <main className="bg-neutral-200 pt-2">
        <Header Categories={Categories} />
        <div className="flex gap-2 max-w-[1800px] justify-center mx-auto">
          <SideCategoryBar posts={TopViewedPosts} position="left" />
          <div className="md:min-w-[600px] w-full max-w-[700px] shadow-md">
            {children}
            <FeaturedSection
              LatestPosts={LatestPosts}
              TopViewedPosts={TopViewedPosts}
            />
          </div>
          <SideCategoryBar2 posts={LatestPosts} position="right" />
        </div>
        <Footer Categories={Categories} />
      </main>
    </Sidebar>
  );
};

export default Layout;

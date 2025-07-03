import React from "react";
import PostCard from "./PostCard";
import { Post } from "@/app/page";

interface CategorySectionProps {
  title: string;
  posts: Post[];
}

const CategorySection = ({ posts }: CategorySectionProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.post._id}
            className="transform transition duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            <PostCard
              link={`/view/${post.post._id}`}
              title={post.post.title}
              category={post.post.category}
              imageURL={post.post.imageURL}
              tags={post.post.tags}
              likes={post.post.likes}
              views={post.post.views}
              description={post.post.description}
              createdAt={post.post.createdAt}
              profilePic={post.author.profilePic}
              firstName={post.author.firstName}
              lastName={post.author.lastName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;

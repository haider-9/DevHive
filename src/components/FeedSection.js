"use client";
import { useEffect, useState } from "react";
import Card from "./Card";
import { databases, DATABASE_ID, POST_COLLECTION_ID } from "@/appwrite";
import { Query } from "appwrite";

const FeedSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(
          DATABASE_ID,
          POST_COLLECTION_ID,
          [Query.orderDesc("$createdAt"), Query.limit(20)]
        );

        setPosts(response.documents);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="p-8 flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse text-foreground">Loading posts...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-8 flex justify-center items-center min-h-[300px]">
        <div className="text-danger">{error}</div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="p-8 flex justify-center items-center min-h-[300px]">
        <div className="text-foreground-500">
          No posts found. Be the first to create a post!
        </div>
      </section>
    );
  }

  return (
    <section className="p-8 flex flex-wrap gap-6  *:flex-1 m-4">
      {posts.map((post) => (
        <Card
          key={post.$id}
         
          profileImage={post.authorAvatar || "https://github.com/github.png"}
          username={post.authorName || "Anonymous"}
          postHeading={post.title}
          description={
            post.description || post.content?.substring(0, 100) || ""
          }
          hashtags={post.tags || []}
          postImage={post.coverImageUrl || null}
          createdAt={post.$createdAt}
          likeCount={post.likeCount || 0}
          postId={post.$id}
        />
      ))}
    </section>
  );
};

export default FeedSection;

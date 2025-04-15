"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Avatar, Button, Divider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import { LuHeart, LuMessageSquare, LuShare2, LuBookmark } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";
import {
  databases,
  DATABASE_ID,
  POST_COLLECTION_ID,
  storage,
  account,
} from "@/appwrite";
import toast from "react-hot-toast";

export default function PostDetailPage({ params }) {
  const { id } = params;
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [authorAvatar, setAuthorAvatar] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);

        const response = await databases.getDocument(
          DATABASE_ID,
          POST_COLLECTION_ID,
          id
        );

        if (response) {
          setPost(response);

          // Fetch author profile image if we have authorId
          if (response.authorId) {
            try {
              
              const userData = await databases.getDocument(
                DATABASE_ID,
                POST_COLLECTION_ID,
                response.authorId
              );

              if (userData && userData.profileImageId) {
                const imageUrl = storage.getFileView(
                  process.env.NEXT_PUBLIC_BUCKET_ID,
                  userData.profileImageId
                ).href;
                setAuthorAvatar(imageUrl);
              }

              // Option 2: If the authorId is the Appwrite account ID
              // This would be similar to how Sidebar.js fetches the user avatar
            } catch (err) {
              console.error("Error fetching author data:", err);
            }
          }
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = async () => {
    try {
      const newLikeStatus = !liked;
      setLiked(newLikeStatus);

      const updatedLikeCount = post.likeCount + (newLikeStatus ? 1 : -1);

      await databases.updateDocument(
        DATABASE_ID,
        POST_COLLECTION_ID,
        post.$id,
        { likeCount: updatedLikeCount }
      );

      setPost({ ...post, likeCount: updatedLikeCount });

      toast.success(newLikeStatus ? "Post liked!" : "Like removed");
    } catch (err) {
      console.error("Error updating like:", err);
      toast.error("Failed to update like");
      setLiked(!liked);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary py-8 flex items-center justify-center">
        <div className="animate-pulse text-xl text-foreground">
          Loading post...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary py-8">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardBody className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-danger">{error}</h2>
              <Link href="/" className="text-warning hover:underline">
                Return to home
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-primary py-8">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardBody className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-danger">Post not found</h2>
              <p>
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/" className="text-warning hover:underline">
                Return to home
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardBody className="p-8">
          <div className="space-y-6">
            {/* Author info */}
            <div className="flex items-center space-x-4">
              <Avatar
                src={authorAvatar}
                alt={post.authorName || "User"}
                size="lg"
              />
              <div>
                <h3 className="font-bold text-foreground">{post.authorName}</h3>
                <p className="text-sm text-foreground-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Post title */}
            <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>

            {/* Post image if available */}
            {post.coverImageUrl && (
              <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Post content */}
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-headings:font-bold prose-headings:text-warning prose-p:text-foreground prose-a:text-warning prose-a:underline hover:prose-a:text-warning prose-strong:text-warning-700 prose-ul:list-disc prose-ol:list-decimal prose-pre:bg-background prose-pre:text-foreground-700 prose-code:font-mono prose-code:text-warning-800 prose-code:bg-background-200 prose-blockquote:font-light prose-blockquote:border-l-4 prose-blockquote:border-warning prose-blockquote:pl-4 prose-blockquote:italic prose-hr:border-warning-300">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {post.tags &&
                post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-background-100 text-foreground-700 px-2 py-1 rounded-md text-sm"
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            <Divider />

            {/* Interaction buttons */}
            <div className="flex justify-between">
              <Button
                color={liked ? "warning" : "default"}
                variant="ghost"
                startContent={
                  <LuHeart className={liked ? "fill-warning" : ""} />
                }
                onClick={handleLike}
              >
                {post.likeCount || 0}
              </Button>

              <Button variant="ghost" startContent={<LuMessageSquare />}>
                Comment
              </Button>

              <Button variant="ghost" startContent={<LuShare2 />}>
                Share
              </Button>

              <Button
                color={bookmarked ? "warning" : "default"}
                variant="ghost"
                startContent={
                  <LuBookmark className={bookmarked ? "fill-warning" : ""} />
                }
                onClick={handleBookmark}
              >
                {bookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import {
  LuTwitter,
  LuLinkedin,
  LuGithub,
  LuCamera,
  LuGlobe,
} from "react-icons/lu";
import { Card, CardBody, Avatar, Button, Spinner } from "@heroui/react";
import Link from "next/link";
import PostCard from "@/components/Card";
import {
  account,
  storage,
  databases,
  DATABASE_ID,
  POST_COLLECTION_ID,
} from "@/appwrite";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Query } from "appwrite";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await account.get();
        setUser(userData);
        console.log("User data:", userData); // Debug log

        // Handle profile image
        if (userData.prefs?.profileImage) {
          // Use the profile image URL saved from edit profile
          setAvatarUrl(userData.prefs.profileImage);
        } else if (userData.prefs?.profileImageId) {
          try {
            const imageUrl = storage.getFilePreview(
              process.env.NEXT_PUBLIC_BUCKET_ID,
              userData.prefs.profileImageId
            ).href;
            setAvatarUrl(imageUrl);
          } catch (storageError) {
            console.error("Error loading custom profile image:", storageError);
          }
        } else if (userData.prefs?.profilePicture) {
          setAvatarUrl(userData.prefs.profilePicture);
        }

        // Handle cover image - first check for direct URL, then fallback to ID
        if (userData.prefs?.coverImage) {
          // Use the cover image URL saved from edit profile
          setCoverUrl(userData.prefs.coverImage);
        } else if (userData.prefs?.coverImageId) {
          try {
            const coverImageUrl = storage.getFilePreview(
              process.env.NEXT_PUBLIC_BUCKET_ID,
              userData.prefs.coverImageId
            ).href;
            setCoverUrl(coverImageUrl);
          } catch (coverError) {
            console.error("Error loading cover image:", coverError);
          }
        }

        // Fetch user's posts
        await fetchUserPosts(userData.$id);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Please sign in to view your profile");
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const fetchUserPosts = async (userId) => {
    try {
      setPostsLoading(true);

      // Query posts where the author is the current user
      const response = await databases.listDocuments(
        DATABASE_ID,
        POST_COLLECTION_ID,
        [Query.equal("authorId", userId)]
      );

      console.log("User posts:", response.documents);
      setUserPosts(response.documents);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Failed to load your posts");
    } finally {
      setPostsLoading(false);
    }
  };

  // Format date for member since display
  const formatMemberSince = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Cover Photo Section */}
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt="Profile cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-warning to-danger"></div>
        )}
      </div>

      {/* Profile Section */}
      <div className="relative z-10 -mt-20 px-4">
        <Card className="mx-auto max-w-4xl bg-secondary shadow-lg">
          <CardBody className="p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="relative">
                {avatarUrl ? (
                  <Avatar
                    src={avatarUrl}
                    alt={user?.name || "User profile"}
                    className="h-32 w-32 border-4 border-secondary text-large"
                    isBordered
                    color="warning"
                  />
                ) : (
                  <Avatar
                    name={user?.name || "User"}
                    className="h-32 w-32 border-4 border-secondary text-large"
                    isBordered
                    color="warning"
                  />
                )}
                <Button
                  isIconOnly
                  startContent={<LuCamera className="text-xl text-primary" />}
                  size="sm"
                  color="warning"
                  variant="solid"
                  radius="full"
                  aria-label="Edit Profile Picture"
                  className="absolute bottom-0 right-0"
                />
              </div>
              <div className="flex flex-grow flex-col items-center md:items-start">
                <div className="mb-4 flex w-full flex-col items-center md:flex-row md:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                      {user?.name || "User"}
                    </h1>
                    <p className="text-foreground-500">
                      {user?.prefs?.role || "Developer"}
                    </p>
                    <p className="text-sm text-foreground-400 mt-1">
                      Member since {formatMemberSince(user?.$createdAt)}
                    </p>
                  </div>
                  <Link href="/edit">
                    <Button
                      color="warning"
                      variant="flat"
                      className="mt-2 md:mt-0"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                <p className="mt-2 text-center text-foreground-500 md:text-left">
                  {user?.prefs?.bio || "No bio available"}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                  {user?.prefs?.website && (
                    <Link
                      href={user.prefs.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-secondary-100 p-2 text-foreground-500 shadow-md transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      <LuGlobe size={20} />
                    </Link>
                  )}
                  {user?.prefs?.twitter && (
                    <Link
                      href={user.prefs.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-secondary-100 p-2 text-foreground-500 shadow-md transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      <LuTwitter size={20} />
                    </Link>
                  )}
                  {user?.prefs?.linkedin && (
                    <Link
                      href={user.prefs.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-secondary-100 p-2 text-foreground-500 shadow-md transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      <LuLinkedin size={20} />
                    </Link>
                  )}
                  {user?.prefs?.github && (
                    <Link
                      href={user.prefs.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-secondary-100 p-2 text-foreground-500 shadow-md transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      <LuGithub size={20} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Posts Section */}
      <div className="mx-auto mt-8 max-w-5xl p-4">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          My Posts
        </h2>

        {postsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-warning"></div>
          </div>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPosts.map((post) => (
              <PostCard
                key={post.$id}
                profileImage={avatarUrl || "https://github.com/github.png"}
                username={user?.name || "User"}
                postHeading={post.title}
                description={post.content}
                hashtags={post.tags || []}
                postImage={post.coverImageUrl || null}
                createdAt={post.$createdAt}
                likeCount={post.likeCount || 0}
                postId={post.$id}
                userId={user?.$id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-secondary rounded-xl p-8 text-center">
            <p className="text-foreground-500 mb-4">
              You haven't created any posts yet.
            </p>
            <Link href="/post/add">
              <Button color="warning">Create Your First Post</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

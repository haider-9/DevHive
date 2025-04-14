"use client";
import Link from "next/link";
import {
  LuTrendingUp,
  LuBookmark,
  LuTag,
  LuUsers,
  LuSettings,
  LuLogOut,
  LuPlus,
  LuMessageCircle,
  LuInfo,
} from "react-icons/lu";
import { FaHouse } from "react-icons/fa6";
import { Avatar, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavLink from "./NavLink";
import { account, storage } from "@/appwrite";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const sideLinks = [
  { name: "Home", icon: <FaHouse />, href: "/" },
  { name: "Trending", icon: <LuTrendingUp />, href: "/trending" },
  { name: "Bookmarks", icon: <LuBookmark />, href: "/bookmarks" },
  { name: "Topics", icon: <LuTag />, href: "/topics" },
  { name: "Communities", icon: <LuUsers />, href: "/communities" },
  { name: "About", icon: <LuInfo />, href: "/about" },
];

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserFromAppwrite();
  }, []);

  const fetchUserFromAppwrite = async () => {
    try {
      setLoading(true);
      const userData = await account.get();
      setUser(userData);

      // Get profile image if available
      if (userData.prefs?.profileImage) {
        // Use the profile image URL saved from edit profile
        setAvatarUrl(userData.prefs.profileImage);
      } else if (userData.prefs?.profileImageId) {
        const imageUrl = storage.getFileView(
          process.env.NEXT_PUBLIC_BUCKET_ID,
          userData.prefs.profileImageId
        ).href;
        setAvatarUrl(imageUrl);
      } else {
        // Check for OAuth provider images
        try {
          const identities = await account.listIdentities();
          
          // Look for GitHub or Google identity
          const githubIdentity = identities.find(identity => identity.provider === 'github');
          const googleIdentity = identities.find(identity => identity.provider === 'google');
          
          if (githubIdentity) {
            // For GitHub, we can construct the avatar URL
            const githubId = githubIdentity.providerUserId;
            setAvatarUrl(`https://avatars.githubusercontent.com/u/${githubId}`);
          } 
          else if (googleIdentity && googleIdentity.providerUserInfo?.picture) {
            // For Google, the picture URL might be in the provider user info
            setAvatarUrl(googleIdentity.providerUserInfo.picture);
          }
        } catch (error) {
          console.error("Error fetching user identities:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching user from Appwrite:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      toast.success("User logged out");
      setUser(null);
      router.push("/signin");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <aside className="pb-8 text-foreground h-screen fixed top-6 left-6 w-20 lg:w-80 flex flex-col transition-all duration-300">
        <div className="flex-1 flex flex-col overflow-y-auto space-y-4">
          <div className="bg-secondary shadow-lg rounded-2xl p-4 lg:p-6 flex flex-col items-center gap-6">
            <div className="animate-pulse w-full">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="hidden lg:block w-full">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "pb-8 text-foreground h-screen fixed top-6 left-6 w-20 lg:w-80 flex flex-col transition-all duration-300",
        { "hidden lg:flex": user }
      )}
    >
      <div className="flex-1 flex flex-col overflow-y-auto space-y-4">
        <div className="bg-secondary shadow-lg rounded-2xl p-4 lg:p-6 flex flex-col items-center gap-6">
          <Link href="/profile" className="w-full">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <Avatar
                src={avatarUrl || "https://preview.redd.it/anyone-know-where-the-hell-this-image-of-vegeta-is-from-v0-xvpfgi2pfgra1.jpg?width=1080&crop=smart&auto=webp&s=78f4afefe709a809e6a3a2a381e7d99895c911e3"}
                size="lg"
                radius="full"
                isBordered
                color="warning"
              />
              <div className="hidden lg:block overflow-hidden">
                <div className="font-semibold text-lg text-warning truncate">
                  {user?.name || "User"}
                </div>
                <div className="text-sm text-neutral-400 truncate">
                  {user?.email || ""}
                </div>
              </div>
            </div>
          </Link>
          <div className="flex gap-2 w-full">
            <Link
              href="/post/add"
              className="hidden grow p-3 rounded-xl bg-warning text-secondary lg:flex items-center justify-center gap-3"
            >
              <LuPlus className="text-xl" />
              New Post
            </Link>
            <Link
              href="/chats"
              className="p-3 rounded-xl bg-warning text-secondary flex items-center justify-center gap-3 flex-grow lg:flex-grow-0"
            >
              <LuMessageCircle className="text-xl" />
            </Link>
          </div>
        </div>

        <nav className="bg-secondary shadow-lg rounded-2xl flex-1 flex flex-col justify-start items-center gap-2 p-4">
          {sideLinks.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              className="w-full p-3 flex items-center justify-center lg:justify-start gap-3 hover:bg-warning hover:text-primary rounded-xl transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden lg:inline">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="bg-secondary shadow-lg flex flex-col justify-center items-center rounded-2xl p-4">
          <Link
            href="/settings"
            className="w-full p-3 flex items-center justify-center lg:justify-start gap-3 hover:bg-warning hover:text-primary rounded-xl transition-colors"
          >
            <LuSettings className="text-xl" />
            <span className="hidden lg:inline">Settings</span>
          </Link>
          <Button
            color="danger"
            variant="light"
            startContent={<LuLogOut className="text-xl" />}
            className="w-full p-3 justify-center lg:justify-start mt-2"
            onClick={handleLogout}
          >
            <span className="hidden lg:inline">Log Out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

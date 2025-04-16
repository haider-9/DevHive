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
  LuInfo,
  LuLogIn,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { FaHouse } from "react-icons/fa6";
import { Avatar, Button } from "@heroui/react";
import { useEffect, useState, useRef } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null);

  useEffect(() => {
    fetchUserFromAppwrite();
  }, []);

  // Close sidebar when clicking outside of it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768 &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Close sidebar on window resize (if transitioning to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchUserFromAppwrite = async () => {
    try {
      setLoading(true);
      const userData = await account.get();
      setUser(userData);

      if (userData.prefs?.profileImage) {
        setAvatarUrl(userData.prefs.profileImage);
      } else if (userData.prefs?.profileImageId) {
        const imageUrl = storage.getFileView(
          process.env.NEXT_PUBLIC_BUCKET_ID,
          userData.prefs.profileImageId
        ).href;
        setAvatarUrl(imageUrl);
      } else {
        try {
          const identities = await account.listIdentities();

          const githubIdentity = identities.find(
            (identity) => identity.provider === "github"
          );
          const googleIdentity = identities.find(
            (identity) => identity.provider === "google"
          );

          if (githubIdentity) {
            const githubId = githubIdentity.providerUserId;
            setAvatarUrl(`https://avatars.githubusercontent.com/u/${githubId}`);
          } else if (
            googleIdentity &&
            googleIdentity.providerUserInfo?.picture
          ) {
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
      setSidebarOpen(false);
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mobile sidebar toggle button with improved positioning
  const SidebarToggle = () => (
    <Button
      isIconOnly
      color="warning"
      variant="solid"
      className="fixed top-4 left-4 z-50 md:hidden shadow-lg"
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      {sidebarOpen ? (
        <LuX className="text-xl" />
      ) : (
        <LuMenu className="text-xl" />
      )}
    </Button>
  );

  if (loading) {
    return (
      <>
        <SidebarToggle />
        <aside className="pb-8 text-foreground h-screen fixed top-0 left-0 w-20 lg:w-64 xl:w-80 flex flex-col transition-all duration-300 p-6">
          <div className="flex-1 flex flex-col overflow-y-auto space-y-4">
            <div className="bg-secondary shadow-lg rounded-2xl p-4 lg:p-6 flex flex-col items-center gap-6">
              <div className="animate-pulse w-full">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="hidden lg:block w-full">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </>
    );p
  }

  return (
    <>
      <SidebarToggle />

      <aside
        ref={sidebarRef}
        className={cn(
          "pb-8 text-foreground h-screen fixed top-0 left-0 w-20 sm:w-24 lg:w-64 xl:w-80 flex flex-col transition-all duration-300 z-40 p-2 sm:p-4 md:p-6 bg-background/80 backdrop-blur-md",
          {
            "translate-x-0": sidebarOpen,
            "-translate-x-full md:translate-x-0": !sidebarOpen,
          }
        )}
      >
        <div className="flex-1 flex flex-col overflow-y-auto space-y-3 sm:space-y-4 mt-14 md:mt-0">
          <div className="bg-secondary/90 shadow-lg hover:shadow-xl transition-shadow rounded-xl p-3 sm:p-4 lg:p-6 flex flex-col items-center gap-4 sm:gap-6">
            {user ? (
              // User is logged in - show profile
              <Link href={`/profile/`} className="w-full group">
                <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 transition-transform hover:scale-[1.02]">
                  <Avatar
                    src={
                      avatarUrl ||
                      "https://preview.redd.it/anyone-know-where-the-hell-this-image-of-vegeta-is-from-v0-xvpfgi2pfgra1.jpg?width=1080&crop=smart&auto=webp&s=78f4afefe709a809e6a3a2a381e7d99895c911e3"
                    }
                    size="md"
                    className="lg:h-12 lg:w-12 group-hover:ring-2 ring-warning transition-all"
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
            ) : (
              // User is not logged in - show login button
              <Link
                href="/signin"
                className="w-full p-2 sm:p-3 rounded-xl bg-warning text-secondary flex items-center justify-center gap-2 sm:gap-3 hover:brightness-110 transition-all active:scale-95"
                onClick={() => setSidebarOpen(false)}
              >
                <LuLogIn className="text-lg sm:text-xl" />
                <span className="hidden lg:inline">Log In</span>
              </Link>
            )}

            {user && (
              <div className="flex gap-2 w-full">
                <Link
                  href="/post/add"
                  className="hidden grow p-2 sm:p-3 rounded-xl bg-warning text-secondary lg:flex items-center justify-center gap-2 sm:gap-3 hover:brightness-110 transition-all active:scale-95"
                  onClick={() => setSidebarOpen(false)}
                >
                  <LuPlus className="text-lg sm:text-xl" />
                  New Post
                </Link>
              </div>
            )}
          </div>

          <nav className="bg-secondary/90 shadow-lg hover:shadow-xl transition-shadow rounded-xl flex-1 flex flex-col justify-start items-center gap-1 sm:gap-2 p-3 sm:p-4">
            {sideLinks.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                className="w-full p-2 sm:p-3 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 hover:bg-warning hover:text-primary rounded-xl transition-all active:scale-95"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg sm:text-xl">{item.icon}</span>
                <span className="hidden lg:inline">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="bg-secondary/90 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-center items-center rounded-xl p-3 sm:p-4">
            <Link
              href="/edit"
              className="w-full p-2 sm:p-3 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 hover:bg-warning hover:text-primary rounded-xl transition-all active:scale-95"
              onClick={() => setSidebarOpen(false)}
            >
              <LuSettings className="text-lg sm:text-xl" />
              <span className="hidden lg:inline">Settings</span>
            </Link>

            {user && (
              <Button
                color="danger"
                variant="light"
                startContent={<LuLogOut className="text-lg sm:text-xl" />}
                className="w-full p-2 sm:p-3 justify-center lg:justify-start mt-2 hover:brightness-110 active:scale-95 transition-all"
                onClick={handleLogout}
              >
                <span className="hidden lg:inline">Log Out</span>
              </Button>
            )}
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed  bg-black/50 backdrop-blur-sm z-30 md:hidden"
          style={{
            height: "100vh",
            height: "calc(var(--vh, 1vh) * 100)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

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
  LuLogIn,
  LuMenu,
  LuX,
  LuSearch,
  LuSun,
  LuMoon,
  LuBell,
  LuMessageSquare,
  LuHeart,
  LuStar,
} from "react-icons/lu";
import { FaHouse } from "react-icons/fa6";
import {
  Avatar,
  Button,
  Input,
  Switch,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NavLink from "./NavLink";
import { account, storage } from "@/appwrite";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

// Dummy notification data
const dummyNotifications = [
  {
    id: 1,
    type: "mention",
    user: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    content: "mentioned you in a comment",
    post: "Building a Modern React App",
    time: "2 minutes ago",
    read: false,
    icon: <LuMessageSquare className="text-blue-500" />,
  },
  {
    id: 2,
    type: "like",
    user: {
      name: "Alex Chen",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    content: "liked your post",
    post: "CSS Grid vs Flexbox",
    time: "1 hour ago",
    read: false,
    icon: <LuHeart className="text-red-500" />,
  },
  {
    id: 3,
    type: "follow",
    user: {
      name: "Miguel Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
    content: "started following you",
    time: "3 hours ago",
    read: true,
    icon: <LuStar className="text-yellow-500" />,
  },
  {
    id: 4,
    type: "like",
    user: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    content: "liked your comment",
    post: "JavaScript Promises Explained",
    time: "Yesterday",
    read: true,
    icon: <LuHeart className="text-red-500" />,
  },
  {
    id: 5,
    type: "mention",
    user: {
      name: "David Wilson",
      avatar: "https://i.pravatar.cc/150?img=53",
    },
    content: "replied to your comment",
    post: "Getting Started with TypeScript",
    time: "2 days ago",
    read: true,
    icon: <LuMessageSquare className="text-blue-500" />,
  },
];

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
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const searchInputRef = useRef(null);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const sidebarRef = useRef(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  useEffect(() => {
    fetchUserFromAppwrite();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
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

  // Mobile search component with improved transitions
  const MobileSearch = () => (
    <div
      className={`fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-16 transition-all duration-300 ${
        isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full max-w-md px-4 animate-fadeIn">
        <div className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            isClearable
            startContent={<LuSearch className="text-input" />}
            placeholder="Search..."
            className="text-input w-full"
            classNames={{
              inputWrapper: "bg-secondary focus:bg-secondary/80",
            }}
          />
          <Button
            isIconOnly
            color="danger"
            variant="light"
            size="sm"
            className="absolute -top-10 right-0"
            onClick={toggleSearch}
            aria-label="Close search"
          >
            <LuX className="text-xl" />
          </Button>
        </div>
      </div>
    </div>
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
    );
  }

  return (
    <>
      <SidebarToggle />
      <MobileSearch />

      <aside
        ref={sidebarRef}
        className={cn(
          "pb-8 text-foreground h-screen fixed top-0 left-0 w-20 sm:w-24 lg:w-64 xl:w-80 flex flex-col transition-all duration-300 z-40 p-2 sm:p-4 md:p-6",
          {
            "translate-x-0": sidebarOpen,
            "-translate-x-full md:translate-x-0": !sidebarOpen,
          }
        )}
      >
        <div className="flex-1 flex flex-col overflow-y-auto space-y-3 sm:space-y-4 mt-14 md:mt-0">
          {/* Mobile navbar functionality */}
          <div className="md:hidden bg-secondary shadow-lg rounded-xl p-3 flex items-center justify-between">
            <Button
              isIconOnly
              color="warning"
              variant="light"
              onClick={toggleSearch}
              className="text-lg"
              aria-label="Search"
            >
              <LuSearch />
            </Button>

            <div className="flex items-center gap-2">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    color="warning"
                    aria-label="Notifications"
                    className="relative"
                  >
                    <LuBell className="text-lg" />
                    {unreadCount > 0 && (
                      <Badge
                        content={unreadCount}
                        color="danger"
                        shape="circle"
                        size="sm"
                        className="absolute -top-1 -right-1"
                      />
                    )}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Notifications"
                  className="w-72 p-0"
                  closeOnSelect={false}
                >
                  <DropdownItem
                    key="header"
                    className="h-14 flex justify-between items-center"
                    textValue="Notifications"
                  >
                    <span className="text-lg font-bold">Notifications</span>
                    {unreadCount > 0 && (
                      <Button
                        size="sm"
                        variant="light"
                        color="warning"
                        onClick={markAllAsRead}
                      >
                        Mark all read
                      </Button>
                    )}
                  </DropdownItem>
                  <DropdownItem
                    key="divider"
                    className="h-px bg-gray-200 dark:bg-gray-700"
                    textValue="divider"
                  />

                  {notifications.length === 0 ? (
                    <DropdownItem
                      key="empty"
                      className="h-24 flex items-center justify-center"
                      textValue="No notifications"
                    >
                      <p className="text-gray-500">No notifications yet</p>
                    </DropdownItem>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownItem
                        key={notification.id}
                        textValue={notification.content}
                        className={`py-3 ${notification.read ? "opacity-70" : "bg-warning/10"}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={notification.user.avatar}
                                size="sm"
                                className="flex-shrink-0"
                              />
                              <span className="font-semibold truncate text-sm">
                                {notification.user.name}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm mt-1">
                              {notification.content}
                              {notification.post && (
                                <span className="font-medium">
                                  {" "}
                                  on "{notification.post}"
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </DropdownItem>
                    ))
                  )}

                  <DropdownItem
                    key="view-all"
                    className="h-12 flex justify-center items-center text-warning"
                    textValue="View all notifications"
                  >
                    <Button
                      as="a"
                      href="/notifications"
                      variant="light"
                      color="warning"
                      className="w-full"
                      onClick={() => setSidebarOpen(false)}
                    >
                      View all notifications
                    </Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Switch
                isSelected={isDark}
                size="sm"
                color="secondary"
                startContent={<LuSun />}
                endContent={<LuMoon />}
                onChange={() => setTheme(isDark ? "light" : "dark")}
              />
            </div>
          </div>

          <div className="bg-secondary shadow-lg rounded-xl p-3 sm:p-4 lg:p-6 flex flex-col items-center gap-4 sm:gap-6">
            {user ? (
              // User is logged in - show profile
              <Link href="/profile" className="w-full">
                <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <Avatar
                    src={
                      avatarUrl ||
                      "https://preview.redd.it/anyone-know-where-the-hell-this-image-of-vegeta-is-from-v0-xvpfgi2pfgra1.jpg?width=1080&crop=smart&auto=webp&s=78f4afefe709a809e6a3a2a381e7d99895c911e3"
                    }
                    size="md"
                    className="lg:h-12 lg:w-12"
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
                className="w-full p-2 sm:p-3 rounded-xl bg-warning text-secondary flex items-center justify-center gap-2 sm:gap-3"
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
                  className="hidden grow p-2 sm:p-3 rounded-xl bg-warning text-secondary lg:flex items-center justify-center gap-2 sm:gap-3"
                  onClick={() => setSidebarOpen(false)}
                >
                  <LuPlus className="text-lg sm:text-xl" />
                  New Post
                </Link>
                <Link
                  href="/chats"
                  className="p-2 sm:p-3 rounded-xl bg-warning text-secondary flex items-center justify-center gap-2 sm:gap-3 flex-grow lg:flex-grow-0"
                  onClick={() => setSidebarOpen(false)}
                >
                  <LuMessageCircle className="text-lg sm:text-xl" />
                </Link>
              </div>
            )}
          </div>

          <nav className="bg-secondary shadow-lg rounded-xl flex-1 flex flex-col justify-start items-center gap-1 sm:gap-2 p-3 sm:p-4">
            {sideLinks.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                className="w-full p-2 sm:p-3 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 hover:bg-warning hover:text-primary rounded-xl transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg sm:text-xl">{item.icon}</span>
                <span className="hidden lg:inline">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="bg-secondary shadow-lg flex flex-col justify-center items-center rounded-xl p-3 sm:p-4">
            <Link
              href="/edit"
              className="w-full p-2 sm:p-3 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 hover:bg-warning hover:text-primary rounded-xl transition-colors"
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
                className="w-full p-2 sm:p-3 justify-center lg:justify-start mt-2"
                onClick={handleLogout}
              >
                <span className="hidden lg:inline">Log Out</span>
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

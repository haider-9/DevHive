"use client";
import {
  Button,
  Input,
  Switch,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Avatar,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  LuBell,
  LuSearch,
  LuMoon,
  LuSun,
  LuCheck,
  LuMessageSquare,
  LuHeart,
  LuStar,
} from "react-icons/lu";
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

// Export notifications data to be used in Sidebar
export const notificationsData = dummyNotifications;

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const searchInputRef = useRef(null);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
    const handleKeyPress = (event) => {
      if (
        event.ctrlKey &&
        event.key === "k" &&
        document.activeElement !== searchInputRef.current
      ) {
        event.preventDefault();
        searchInputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="flex justify-between lg:justify-around items-center *:bg-primary *:px-4 *:pb-4 *:rounded-b-2xl">
      {/* Search input - hidden on smaller screens */}
      <div className="relative max-w-lg w-full hidden lg:block">
        <div className="relative group">
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center transition-opacity duration-200 opacity-100 group-focus-within:opacity-0 group-focus-within:pointer-events-none">
            <kbd className="px-2 py-1 text-xs font-mono font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md shadow-sm mr-1">
              Ctrl
            </kbd>
            <span className="text-xs text-gray-500 mx-1">+</span>
            <kbd className="px-2 py-1 text-xs font-mono font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md shadow-sm">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right-side controls - always visible, positioned on the right */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="transition-transform duration-300 hover:scale-110">
          <Dropdown
            placement="bottom-end"
            isOpen={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
          >
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="shadow"
                color="primary"
                aria-label="Notifications"
                className="border-none text-white text-2xl relative"
              >
                <LuBell className="text-foreground" />
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
              className="w-80 p-0"
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
                    Mark all as read
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
                    <div className="flex items-start gap-3">
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
                          <span className="font-semibold truncate">
                            {notification.user.name}
                          </span>
                        </div>
                        <p className="text-sm mt-1">
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
                >
                  View all notifications
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Switch
          isSelected={isDark}
          size="lg"
          color="secondary"
          startContent={<LuSun />}
          endContent={<LuMoon />}
          onChange={() => setTheme(isDark ? "light" : "dark")}
        />
      </div>
    </div>
  );
};

export default Navbar;

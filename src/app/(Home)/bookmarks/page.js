"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
  Input,
  Chip
} from "@heroui/react";
import { 
  LuBookmark,
  LuFilter,
  LuSearch,
  LuX,
  LuInfo
} from "react-icons/lu";
import PostCard from "@/components/Card";
import { account } from "@/appwrite";
import Link from "next/link";

// Dummy bookmarked posts data
const dummyBookmarkedPosts = [
  {
    postId: "1",
    profileImage: "https://i.pravatar.cc/150?img=11",
    username: "Alex Chen",
    postHeading: "Understanding React Server Components in Next.js 14",
    description: "React Server Components represent a paradigm shift in how we build React applications. In this post, I'll explain the core concepts and show practical examples of how to leverage them in Next.js 14.",
    hashtags: ["React", "Next.js", "WebDev"],
    postImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2023-11-15T14:23:00Z",
    likeCount: 842,
    bookmarkedAt: "2023-11-16T08:45:00Z"
  },
  {
    postId: "2",
    profileImage: "https://i.pravatar.cc/150?img=47",
    username: "Priya Sharma",
    postHeading: "The Ultimate Guide to CSS Grid in 2024",
    description: "CSS Grid has revolutionized web layouts. This comprehensive guide covers everything from basic concepts to advanced techniques that will help you master grid layouts for modern web applications.",
    hashtags: ["CSS", "WebDesign", "Frontend"],
    postImage: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2023-11-12T09:15:00Z",
    likeCount: 756,
    bookmarkedAt: "2023-11-14T12:30:00Z"
  },
  {
    postId: "3",
    profileImage: "https://i.pravatar.cc/150?img=68",
    username: "Miguel Rodriguez",
    postHeading: "Building a Real-time Chat Application with Socket.io and Node.js",
    description: "In this tutorial, I'll walk you through creating a scalable real-time chat application using Socket.io, Node.js, and Express. We'll cover authentication, message persistence, and deployment strategies.",
    hashtags: ["Node.js", "Socket.io", "RealTime"],
    postImage: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2023-11-10T16:45:00Z",
    likeCount: 621,
    bookmarkedAt: "2023-11-11T09:20:00Z"
  },
  {
    postId: "4",
    profileImage: "https://i.pravatar.cc/150?img=53",
    username: "David Wilson",
    postHeading: "TypeScript 5.3: What's New and Improved",
    description: "TypeScript 5.3 brings several exciting features and improvements. In this post, I'll highlight the most important changes and demonstrate how they can enhance your development workflow.",
    hashtags: ["TypeScript", "JavaScript", "Programming"],
    postImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2023-11-08T11:30:00Z",
    likeCount: 589,
    bookmarkedAt: "2023-11-10T15:45:00Z"
  }
];

// Dummy reading list data
const dummyReadingLists = [
  { id: "1", name: "Frontend Development", count: 12 },
  { id: "2", name: "Backend Technologies", count: 8 },
  { id: "3", name: "UI/UX Design", count: 5 },
  { id: "4", name: "Career Growth", count: 3 }
];

export default function BookmarksPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [readingLists, setReadingLists] = useState(dummyReadingLists);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    checkUser();

    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setPosts(dummyBookmarkedPosts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter posts based on search query and selected tags
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.postHeading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      post.hashtags.some(tag => selectedTags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Get all unique tags from posts
  const allTags = [...new Set(posts.flatMap(post => post.hashtags))];

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  if (!user && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="bg-secondary p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
          <LuInfo className="text-warning text-3xl sm:text-4xl md:text-5xl mx-auto mb-3 sm:mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Sign In to View Your Bookmarks</h1>
          <p className="text-default-500 mb-4 sm:mb-6 text-sm sm:text-base">
            You need to be signed in to save and view your bookmarked posts.
          </p>
          <Button
            as={Link}
            href="/signin"
            color="warning"
            size="lg"
            className="font-semibold w-full sm:w-auto"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <LuBookmark className="text-warning text-2xl sm:text-3xl" />
          <h1 className="text-2xl sm:text-3xl font-bold">Your Bookmarks</h1>
        </div>
      </div>

      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={setSelectedTab}
        className="mb-4 sm:mb-6"
      >
        <Tab key="all" title="All Bookmarks" />
        <Tab key="readingLists" title="Reading Lists" />
      </Tabs>

      {selectedTab === "all" ? (
        <>
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            <Input
              placeholder="Search in your bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<LuSearch />}
              clearable
              onClear={() => setSearchQuery("")}
              className="w-full"
            />
            
            <div className="flex justify-end">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="flat" 
                    color="default"
                    startContent={<LuFilter />}
                    className="w-full sm:w-auto"
                  >
                    Filter
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Filter options" closeOnSelect={false}>
                  <DropdownItem key="tags" isReadOnly className="font-bold">
                    Filter by Tags
                  </DropdownItem>
                  {allTags.map(tag => (
                    <DropdownItem 
                      key={tag} 
                      startContent={
                        <input 
                          type="checkbox" 
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="mr-2"
                        />
                      }
                    >
                      {tag}
                    </DropdownItem>
                  ))}
                  <DropdownItem key="clear" className="text-danger" onClick={clearFilters}>
                    Clear Filters
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map(tag => (
                <Chip 
                  key={tag}
                  onClose={() => toggleTag(tag)}
                  variant="flat"
                  color="warning"
                  size="sm"
                >
                  {tag}
                </Chip>
              ))}
              <Button 
                size="sm" 
                variant="light" 
                color="danger" 
                onClick={clearFilters}
                startContent={<LuX />}
              >
                Clear All
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <Spinner size="lg" color="warning" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  profileImage={post.profileImage}
                  username={post.username}
                  postHeading={post.postHeading}
                  description={post.description}
                  hashtags={post.hashtags}
                  postImage={post.postImage}
                  createdAt={post.createdAt}
                  likeCount={post.likeCount}
                  postId={post.postId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-16">
              <LuBookmark className="text-warning text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4 opacity-50" />
              <h2 className="text-lg sm:text-xl font-semibold mb-2">No bookmarks found</h2>
              <p className="text-default-500 text-sm sm:text-base">
                {searchQuery || selectedTags.length > 0 
                  ? "Try adjusting your search or filters" 
                  : "Start bookmarking posts to save them for later"}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {readingLists.map(list => (
            <Button
              key={list.id}
              as={Link}
              href={`/bookmarks/list/${list.id}`}
              variant="flat"
              className="h-auto p-3 sm:p-4 justify-start text-left"
            >
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{list.name}</h3>
                <p className="text-default-500 text-xs sm:text-sm">{list.count} items</p>
              </div>
            </Button>
          ))}
          <Button
            color="warning"
            variant="flat"
            className="h-auto p-3 sm:p-4 justify-center items-center border-2 border-dashed border-warning/30"
          >
            <div className="text-center">
              <span className="block text-xl sm:text-2xl mb-1">+</span>
              <span className="text-sm sm:text-base">Create New List</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}

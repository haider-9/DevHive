"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { 
  LuTrendingUp, 
  LuCalendar,
  LuFlame,
  LuZap
} from "react-icons/lu";
import PostCard from "@/components/Card";

// Dummy trending posts data
const dummyTrendingPosts = [
  {
    postId: "1",
    profileImage: "https://i.pravatar.cc/150?img=11",
    username: "Alex Chen",
    postHeading: "Understanding React Server Components in Next.js 14",
    description: "React Server Components represent a paradigm shift in how we build React applications. In this post, I'll explain the core concepts and show practical examples of how to leverage them in Next.js 14.",
    hashtags: ["React", "Next.js", "WebDev"],
    postImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2023-11-15T14:23:00Z",
    likeCount: 842
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
    likeCount: 756
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
    likeCount: 621
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
    likeCount: 589
  },
  {
    postId: "5",
    profileImage: "https://i.pravatar.cc/150?img=32",
    username: "Sarah Johnson",
    postHeading: "Optimizing React Performance: Advanced Techniques",
    description: "Is your React application suffering from performance issues? This deep dive explores advanced optimization techniques including memoization, virtualization, and code splitting to dramatically improve your app's performance.",
    hashtags: ["React", "Performance", "Optimization"],
    postImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2023-11-05T13:20:00Z",
    likeCount: 542
  },
  {
    postId: "6",
    profileImage: "https://i.pravatar.cc/150?img=59",
    username: "James Lee",
    postHeading: "The Complete Guide to Authentication in Next.js Applications",
    description: "Authentication is a critical aspect of web applications. This comprehensive guide covers various authentication strategies for Next.js applications, from JWT to OAuth and beyond.",
    hashtags: ["Next.js", "Authentication", "Security"],
    postImage: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2023-11-03T10:15:00Z",
    likeCount: 498
  }
];

export default function TrendingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week"); // week, month, year

  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setPosts(dummyTrendingPosts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filterByTimeframe = (timeframe) => {
    setTimeframe(timeframe);
    setLoading(true);
    
    // Simulate API fetch with different data based on timeframe
    setTimeout(() => {
      // In a real app, you would fetch different data based on timeframe
      // For this demo, we'll just shuffle the existing data
      const shuffled = [...dummyTrendingPosts].sort(() => 0.5 - Math.random());
      setPosts(shuffled);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <LuTrendingUp className="text-warning text-2xl sm:text-3xl" />
          <h1 className="text-2xl sm:text-3xl font-bold">Trending on DevHive</h1>
        </div>
        
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="flat" 
              color="warning"
              endContent={<LuCalendar />}
              className="w-full sm:w-auto"
            >
              {timeframe === "week" ? "This Week" : 
               timeframe === "month" ? "This Month" : "This Year"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Timeframe options"
            selectedKeys={[timeframe]}
            selectionMode="single"
            onSelectionChange={(keys) => filterByTimeframe([...keys][0])}
          >
            <DropdownItem key="week" startContent={<LuFlame />}>This Week</DropdownItem>
            <DropdownItem key="month" startContent={<LuZap />}>This Month</DropdownItem>
            <DropdownItem key="year">This Year</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" color="warning" />
        </div>
      ) : (
        <div className="flex items-center flex-col lg:flex-row">
          {posts.map((post) => (
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
      )}

      {!loading && (
        <div className="mt-10 flex justify-center">
          <Button
            color="warning"
            variant="bordered"
            size="lg"
            className="font-semibold"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

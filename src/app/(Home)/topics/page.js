"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Spinner,
  Input,
  Card,
  CardBody,
  Chip,
  Avatar
} from "@heroui/react";
import { 
  LuTag,
  LuSearch,
  LuTrendingUp,
  LuPlus,
  LuBookmark,
  LuHash
} from "react-icons/lu";
import Link from "next/link";

// Dummy topics data
const dummyTopics = [
  {
    id: "1",
    name: "React",
    description: "A JavaScript library for building user interfaces",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    postsCount: 12453,
    followersCount: 8765,
    isFollowing: true,
    relatedTopics: ["JavaScript", "Redux", "Next.js"],
    trending: true
  },
  {
    id: "2",
    name: "TypeScript",
    description: "A typed superset of JavaScript that compiles to plain JavaScript",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
    postsCount: 9876,
    followersCount: 7654,
    isFollowing: true,
    relatedTopics: ["JavaScript", "Angular", "Node.js"],
    trending: true
  },
  {
    id: "3",
    name: "Next.js",
    description: "The React framework for production",
    icon: "https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png",
    postsCount: 8765,
    followersCount: 6543,
    isFollowing: false,
    relatedTopics: ["React", "Vercel", "SSR"],
    trending: true
  },
  {
    id: "4",
    name: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    icon: "https://nodejs.org/static/images/logo.svg",
    postsCount: 7654,
    followersCount: 5432,
    isFollowing: true,
    relatedTopics: ["JavaScript", "Express", "API"],
    trending: false
  },
  {
    id: "5",
    name: "Python",
    description: "A programming language that lets you work quickly and integrate systems effectively",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
    postsCount: 6543,
    followersCount: 4321,
    isFollowing: false,
    relatedTopics: ["Django", "Flask", "Data Science"],
    trending: true
  },
  {
    id: "6",
    name: "Docker",
    description: "A platform for developing, shipping, and running applications in containers",
    icon: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png",
    postsCount: 5432,
    followersCount: 3210,
    isFollowing: false,
    relatedTopics: ["Kubernetes", "DevOps", "Containers"],
    trending: false
  }
];

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setTopics(dummyTopics);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter topics based on search query and following status
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = searchQuery === "" || 
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showFollowing) {
      return matchesSearch && topic.isFollowing;
    }
    
    return matchesSearch;
  });

  const toggleFollow = (topicId) => {
    setTopics(topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, isFollowing: !topic.isFollowing } 
        : topic
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <LuTag className="text-warning text-3xl" />
          <h1 className="text-3xl font-bold">Topics</h1>
        </div>
        
        <Button
          color={showFollowing ? "warning" : "default"}
          variant={showFollowing ? "solid" : "flat"}
          onClick={() => setShowFollowing(!showFollowing)}
          startContent={<LuBookmark />}
        >
          {showFollowing ? "Following" : "Show Following"}
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<LuSearch />}
          clearable
          onClear={() => setSearchQuery("")}
          className="w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" color="warning" />
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="space-y-4">
          {filteredTopics.map(topic => (
            <Card key={topic.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Avatar
                    src={topic.icon}
                    size="lg"
                    radius="lg"
                    className="flex-shrink-0 mx-auto sm:mx-0"
                  />
                  <div className="flex-grow w-full">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                      <Link href={`/topics/${topic.name.toLowerCase()}`}>
                        <h3 className="font-bold text-lg hover:text-warning transition-colors text-center sm:text-left">
                          {topic.name}
                        </h3>
                      </Link>
                      {topic.trending && (
                        <Chip 
                          color="warning" 
                          variant="flat" 
                          size="sm"
                          startContent={<LuTrendingUp className="text-warning" />}
                        >
                          Trending
                        </Chip>
                      )}
                    </div>
                    <p className="text-sm mt-1 text-default-500 text-center sm:text-left">
                      {topic.followersCount.toLocaleString()} followers • {topic.postsCount.toLocaleString()} posts
                    </p>
                    <p className="text-sm mt-2 text-default-600 text-center sm:text-left">
                      {topic.description}
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                      {topic.relatedTopics.map(relatedTopic => (
                        <Link 
                          key={relatedTopic} 
                          href={`/topics/${relatedTopic.toLowerCase()}`}
                        >
                          <Chip 
                            size="sm" 
                            variant="flat" 
                            className="cursor-pointer hover:bg-default-100"
                            startContent={<LuHash />}
                          >
                            {relatedTopic}
                          </Chip>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center sm:justify-end">
                      <Button
                        color={topic.isFollowing ? "default" : "warning"}
                        variant={topic.isFollowing ? "bordered" : "solid"}
                        size="sm"
                        startContent={topic.isFollowing ? <LuBookmark /> : <LuPlus />}
                        onClick={() => toggleFollow(topic.id)}
                      >
                        {topic.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <LuTag className="text-warning text-4xl mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No topics found</h2>
          <p className="text-default-500">
            {searchQuery 
              ? "Try adjusting your search query" 
              : showFollowing 
                ? "You haven't followed any topics yet" 
                : "No topics available at the moment"}
          </p>
          {showFollowing && (
            <Button
              color="warning"
              variant="flat"
              className="mt-4"
              onClick={() => setShowFollowing(false)}
            >
              Browse All Topics
            </Button>
          )}
        </div>
      )}

      {/* Trending Topics Section */}
      {!showFollowing && !loading && filteredTopics.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <LuTrendingUp className="text-warning" />
            Trending Topics
          </h2>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            {topics
              .filter(topic => topic.trending)
              .map(topic => (
                <Link 
                  key={`trending-${topic.id}`} 
                  href={`/topics/${topic.name.toLowerCase()}`}
                >
                  <Chip
                    variant="flat"
                    color="warning"
                    className="cursor-pointer"
                    avatar={<Avatar src={topic.icon} size="sm" />}
                  >
                    {topic.name}
                  </Chip>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );}

"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Spinner,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Chip,
  Divider,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  LuUsers,
  LuSearch,
  LuPlus,
  LuUserPlus,
  LuTrendingUp,
  LuMessageSquare,
  LuCalendar,
  LuGlobe,
  LuShield,
  LuCode,
  LuStar,
} from "react-icons/lu";
import Link from "next/link";

// Dummy communities data
const dummyCommunities = [
  {
    id: "1",
    name: "React Developers",
    description:
      "A community for React developers to share knowledge, ask questions, and collaborate on projects.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    members: 12453,
    posts: 3245,
    tags: ["React", "JavaScript", "Frontend"],
    isJoined: true,
    isVerified: true,
    activity: "Very Active",
    lastActive: "10 minutes ago",
  },
  {
    id: "2",
    name: "Next.js Enthusiasts",
    description:
      "Everything about Next.js - from beginner tutorials to advanced deployment strategies and performance optimization.",
    logo: "https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png",
    members: 8765,
    posts: 2187,
    tags: ["Next.js", "React", "SSR"],
    isJoined: false,
    isVerified: true,
    activity: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "TypeScript Masters",
    description:
      "Deep dive into TypeScript - types, interfaces, generics, and best practices for large-scale applications.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
    members: 7432,
    posts: 1876,
    tags: ["TypeScript", "JavaScript", "Programming"],
    isJoined: true,
    isVerified: true,
    activity: "Very Active",
    lastActive: "25 minutes ago",
  },
  {
    id: "4",
    name: "Node.js Developers",
    description:
      "Backend development with Node.js - APIs, databases, authentication, and server architecture.",
    logo: "https://nodejs.org/static/images/logo.svg",
    members: 9876,
    posts: 2543,
    tags: ["Node.js", "Backend", "JavaScript"],
    isJoined: false,
    isVerified: true,
    activity: "Active",
    lastActive: "3 hours ago",
  },
  {
    id: "5",
    name: "UI/UX Design Hub",
    description:
      "Discussions about user interface and experience design, wireframing, prototyping, and design systems.",
    logo: "https://cdn-icons-png.flaticon.com/512/5278/5278655.png",
    members: 6543,
    posts: 1765,
    tags: ["UI", "UX", "Design"],
    isJoined: false,
    isVerified: false,
    activity: "Moderate",
    lastActive: "Yesterday",
  },
  {
    id: "6",
    name: "DevOps Engineers",
    description:
      "CI/CD pipelines, containerization, cloud infrastructure, and automation for modern development workflows.",
    logo: "https://cdn-icons-png.flaticon.com/512/8636/8636835.png",
    members: 5432,
    posts: 1432,
    tags: ["DevOps", "Docker", "AWS"],
    isJoined: false,
    isVerified: true,
    activity: "Active",
    lastActive: "2 hours ago",
  },
  {
    id: "7",
    name: "GraphQL Explorers",
    description:
      "Everything about GraphQL - schemas, resolvers, client integration, and performance optimization.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/1200px-GraphQL_Logo.svg.png",
    members: 4321,
    posts: 987,
    tags: ["GraphQL", "API", "Backend"],
    isJoined: true,
    isVerified: false,
    activity: "Moderate",
    lastActive: "2 days ago",
  },
  {
    id: "8",
    name: "Web Accessibility",
    description:
      "Making the web accessible to everyone - WCAG guidelines, assistive technologies, and inclusive design.",
    logo: "https://cdn-icons-png.flaticon.com/512/2867/2867522.png",
    members: 3456,
    posts: 876,
    tags: ["Accessibility", "a11y", "Inclusive Design"],
    isJoined: false,
    isVerified: true,
    activity: "Moderate",
    lastActive: "3 days ago",
  },
];

// Dummy upcoming events data
const dummyEvents = [
  {
    id: "1",
    title: "React Performance Optimization Workshop",
    community: "React Developers",
    date: "2023-12-15T18:00:00Z",
    attendees: 156,
    isOnline: true,
  },
  {
    id: "2",
    title: "Introduction to TypeScript Generics",
    community: "TypeScript Masters",
    date: "2023-12-18T16:30:00Z",
    attendees: 89,
    isOnline: true,
  },
  {
    id: "3",
    title: "Next.js 14 Features Deep Dive",
    community: "Next.js Enthusiasts",
    date: "2023-12-20T19:00:00Z",
    attendees: 112,
    isOnline: true,
  },
];

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("discover");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setCommunities(dummyCommunities);
      setEvents(dummyEvents);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter communities based on search query
  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      searchQuery === "" ||
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Filter based on selected tab
    if (selectedTab === "joined") {
      return matchesSearch && community.isJoined;
    }

    return matchesSearch;
  });

  // Format date for events
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LuUsers className="text-warning text-3xl" />
          <h1 className="text-3xl font-bold">Communities</h1>
        </div>

        <Button
          color="warning"
          startContent={<LuPlus />}
          as={Link}
          href="/communities/create"
        >
          Create Community
        </Button>
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
        className="mb-6"
      >
        <Tab key="discover" title="Discover" />
        <Tab key="joined" title="Joined" />
        <Tab key="events" title="Upcoming Events" />
      </Tabs>

      {selectedTab !== "events" && (
        <div className="mb-6">
          <Input
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<LuSearch />}
            clearable
            onClear={() => setSearchQuery("")}
            className="w-full max-w-xl"
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" color="warning" />
        </div>
      ) : selectedTab === "events" ? (
        // Events tab content
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <Card
                key={event.id}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md font-semibold">{event.title}</p>
                    <p className="text-small text-default-500">
                      by {event.community}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="flex items-center gap-2 mb-2">
                    <LuCalendar className="text-warning" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <LuUsers className="text-warning" />
                    <span>{event.attendees} attending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuGlobe className="text-warning" />
                    <span>
                      {event.isOnline ? "Online Event" : "In-person Event"}
                    </span>
                  </div>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Button color="warning" variant="flat" fullWidth>
                    RSVP
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <LuCalendar className="text-warning text-4xl mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">No upcoming events</h2>
              <p className="text-default-500">
                Check back later for new community events
              </p>
            </div>
          )}
        </div>
      ) : filteredCommunities.length > 0 ? (
        // Communities grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <Card
              key={community.id}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex gap-3">
                <Avatar src={community.logo} size="lg" radius="lg" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="text-md font-semibold">{community.name}</p>
                    {community.isVerified && (
                      <LuShield
                        className="text-warning"
                        title="Verified Community"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-small text-default-500">
                      {community.members.toLocaleString()} members
                    </p>
                    <span className="text-small text-default-500">•</span>
                    <p className="text-small text-default-500">
                      {community.posts.toLocaleString()} posts
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-sm">{community.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {community.tags.map((tag) => (
                    <Chip key={tag} size="sm" variant="flat">
                      {tag}
                    </Chip>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <LuTrendingUp
                    className={`${community.activity === "Very Active" ? "text-success" : community.activity === "Active" ? "text-warning" : "text-default-500"}`}
                  />
                  <span className="text-sm text-default-500">
                    {community.activity} • {community.lastActive}
                  </span>
                </div>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button
                  color={community.isJoined ? "default" : "warning"}
                  variant={community.isJoined ? "flat" : "solid"}
                  startContent={
                    community.isJoined ? <LuMessageSquare /> : <LuUserPlus />
                  }
                  fullWidth
                >
                  {community.isJoined ? "View Discussions" : "Join Community"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // No communities found
        <div className="text-center py-16">
          <LuUsers className="text-warning text-4xl mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No communities found</h2>
          <p className="text-default-500">
            {searchQuery
              ? "Try adjusting your search query"
              : selectedTab === "joined"
                ? "You haven't joined any communities yet"
                : "No communities available at the moment"}
          </p>
          {selectedTab === "joined" && (
            <Button
              color="warning"
              variant="flat"
              className="mt-4"
              onClick={() => setSelectedTab("discover")}
            >
              Discover Communities
            </Button>
          )}
        </div>
      )}

      {/* Trending Communities Section (only on discover tab) */}
      {selectedTab === "discover" &&
        !loading &&
        filteredCommunities.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <LuStar className="text-warning" />
              Trending Communities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dummyCommunities
                .sort((a, b) => b.members - a.members)
                .slice(0, 3)
                .map((community) => (
                  <Card
                    key={`trending-${community.id}`}
                    className="shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardBody className="flex items-center gap-4">
                      <Avatar
                        src={community.logo}
                        size="lg"
                        radius="lg"
                        className="flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold">{community.name}</p>
                          {community.isVerified && (
                            <LuShield
                              className="text-warning"
                              title="Verified Community"
                            />
                          )}
                        </div>
                        <p className="text-xs text-default-500">
                          {community.members.toLocaleString()} members
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {community.tags.slice(0, 2).map((tag) => (
                            <Chip
                              key={tag}
                              size="sm"
                              variant="flat"
                              className="text-xs"
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <Button
                        color={community.isJoined ? "default" : "warning"}
                        variant={community.isJoined ? "flat" : "solid"}
                        size="sm"
                        isIconOnly
                      >
                        {community.isJoined ? <LuCode /> : <LuUserPlus />}
                      </Button>
                    </CardBody>
                  </Card>
                ))}
            </div>
          </div>
        )}

      {/* Recently Active Communities (only on joined tab) */}
      {selectedTab === "joined" &&
        !loading &&
        filteredCommunities.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <LuMessageSquare className="text-warning" />
              Recently Active
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunities
                .filter((community) => community.isJoined)
                .sort((a, b) => {
                  // Sort by activity level and then by last active time
                  if (a.activity === b.activity) {
                    return a.lastActive.localeCompare(b.lastActive);
                  }
                  return a.activity === "Very Active" ? -1 : 1;
                })
                .slice(0, 2)
                .map((community) => (
                  <Card
                    key={`active-${community.id}`}
                    className="shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardBody>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar src={community.logo} size="md" radius="lg" />
                        <div>
                          <p className="font-semibold">{community.name}</p>
                          <p className="text-xs text-default-500">
                            Last active: {community.lastActive}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">
                        New discussions about {community.tags.join(", ")} are
                        waiting for your input!
                      </p>
                      <Button
                        color="warning"
                        variant="flat"
                        size="sm"
                        as={Link}
                        href={`/communities/${community.id}`}
                        fullWidth
                      >
                        View Community
                      </Button>
                    </CardBody>
                  </Card>
                ))}
            </div>
          </div>
        )}

      {/* Upcoming Events Preview (only on discover tab) */}
      {selectedTab === "discover" && !loading && events.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <LuCalendar className="text-warning" />
              Upcoming Events
            </h2>
            <Button
              variant="light"
              color="warning"
              onClick={() => setSelectedTab("events")}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.slice(0, 2).map((event) => (
              <Card
                key={`event-preview-${event.id}`}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardBody>
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <LuCalendar className="text-warning" />
                    <span className="text-sm">
                      {formatEventDate(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <LuUsers className="text-warning" />
                    <span className="text-sm">{event.attendees} attending</span>
                  </div>
                  <Button color="warning" variant="flat" size="sm" fullWidth>
                    RSVP
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

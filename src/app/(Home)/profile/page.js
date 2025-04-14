'use client';
import React from 'react';
import {
  LuTwitter,
  LuLinkedin,
  LuGithub,
  LuFileEdit,
  LuCamera,
} from 'react-icons/lu';
import { Card, CardBody, Avatar, Button, Image } from "@heroui/react";
import Link from 'next/link';
import PostCard from '@/components/Card';

const profileData = {
  profileImage: 'https://github.com/rajazubair.png',
  username: 'Raja Muhammad Zubair',
  role: 'Full Stack Developer',
  bio: 'Passionate about building scalable web applications and exploring new technologies. Always eager to learn and share knowledge with the developer community.',
};

const posts = [
  {
    profileImage: 'https://github.com/rajazubair.png',
    username: 'Raja Muhammad Zubair',
    postHeading: 'Optimizing React Performance',
    description:
      "Exploring advanced techniques to boost your React app's performance.",
    hashtags: ['react', 'performance', 'webdev'],
    postImage: 'https://source.unsplash.com/random/800x600?react',
    createdAt: '2024-03-20T14:30:00Z',
    likeCount: 1234,
  },
  {
    profileImage: 'https://github.com/rajazubair.png',
    username: 'Raja Muhammad Zubair',
    postHeading: 'Building Scalable APIs with Node.js',
    description:
      'Best practices for creating robust and scalable backend services using Node.js.',
    hashtags: ['nodejs', 'api', 'backend'],
    postImage: 'https://source.unsplash.com/random/800x600?server',
    createdAt: '2024-03-18T10:15:00Z',
    likeCount: 987,
  },
  {
    profileImage: 'https://github.com/rajazubair.png',
    username: 'Raja Muhammad Zubair',
    postHeading: 'Mastering TypeScript for Large Projects',
    description:
      'Leveraging TypeScript features to improve code quality and maintainability in large-scale applications.',
    hashtags: ['typescript', 'javascript', 'programming'],
    postImage: 'https://source.unsplash.com/random/800x600?code',
    createdAt: '2024-03-15T09:00:00Z',
    likeCount: 1543,
  },
];
const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-primary">
      {/* Cover Photo Section */}
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        <img
          src="/images/default-cover.jpg"
          alt="Profile Banner"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="relative z-10 -mt-20 px-4">
        <Card className="mx-auto max-w-4xl bg-secondary shadow-lg">
          <CardBody className="p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="relative">
                <Avatar
                  src={profileData.profileImage}
                  alt="Profile"
                  className="h-32 w-32 border-4 border-secondary text-large"
                  isBordered
                  color="warning"
                />
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
                      {profileData.username}
                    </h1>
                    <p className="text-foreground-500">{profileData.role}</p>
                  </div>
                  <Button
                    color="warning"
                    variant="flat"
                    className="mt-2 md:mt-0"
                  >
                    Edit Profile
                  </Button>
                </div>
                <p className="mt-2 text-center text-foreground-500 md:text-left">
                  {profileData.bio}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                  <Link
                    href="https://twitter.com/rajazubair"
                    className="rounded-full bg-secondary-100 p-2 text-foreground-500 shadow-md transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    <LuTwitter size={20} />
                  </Link>
                  <Link
                    href="https://linkedin.com/in/rajazubair"
                    className="rounded-full bg-secondary-100 p-2 text-foreground-500 shadow-md transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    <LuLinkedin size={20} />
                  </Link>
                  <Link
                    href="https://github.com/rajazubair"
                    className="rounded-full bg-secondary-100 p-2 text-foreground-500 shadow-md transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    <LuGithub size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Posts Section */}
      <div className="mx-auto mt-8 max-w-5xl p-4">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Recent Posts
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

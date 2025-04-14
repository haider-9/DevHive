'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  LuBookmark,
  LuMessageSquare,
  LuThumbsDown,
  LuThumbsUp,
  LuArrowDown,
  LuFlag,
  LuShare2,
} from 'react-icons/lu';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
  Tooltip,
  ButtonGroup,
  Chip,
} from "@heroui/react";

const PostCard = ({
  profileImage,
  username,
  postHeading,
  description,
  hashtags,
  postImage,
  createdAt,
  likeCount,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) {
      setIsLiked(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Card className="bg-primary transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="justify-between p-4">
        <div className="flex gap-3">
          <Link
            href={`/profile/${username.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Avatar src={profileImage} alt={username} size="sm" />
          </Link>
          <div className="flex flex-col items-start justify-center">
            <Link
              href={`/profile/${username.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <h4 className="text-small font-semibold leading-none text-default-600 hover:underline">
                {username}
              </h4>
            </Link>
            <h5 className="text-small tracking-tight text-default-400">
              {new Date(createdAt).toLocaleDateString()}
            </h5>
          </div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" disableRipple>
              <LuArrowDown className="text-default-400" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              startContent={<LuFlag />}
              color="danger"
              variant="flat"
              className="text-danger"
            >
              Report Post
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody className="px-4 py-2 text-small text-default-400">
        <Link href={`/post/${postHeading.toLowerCase().replace(/\s+/g, '-')}`}>
          <h2 className="text-large font-bold text-default-600 transition-colors hover:text-primary-100">
            {postHeading}
          </h2>
        </Link>
        <p className="mt-2">{description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {hashtags.map((tag, index) => (
            <Link
              key={index}
              href={`/hashtag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Chip
                color="warning"
                variant="flat"
                size="sm"
                className="cursor-pointer hover:bg-primary-100"
              >
                #{tag}
              </Chip>
            </Link>
          ))}
        </div>
        <Image
          removeWrapper
          alt="Post image"
          className="z-0 mt-2 max-h-60 w-full object-cover"
          src={postImage}
        />
      </CardBody>
      <CardFooter className="flex justify-between gap-3 p-4">
        <ButtonGroup>
          <Button
            color={isLiked ? 'success' : 'default'}
            variant={isLiked ? 'solid' : 'flat'}
            aria-label="Like"
            onClick={handleLike}
            disableRipple
          >
            <LuThumbsUp />
            <span className="ml-1">{likeCount}</span>
          </Button>
          <Button
            color={isDisliked ? 'danger' : 'default'}
            variant="flat"
            aria-label="Dislike"
            onClick={handleDislike}
            disableRipple
            isIconOnly
          >
            <LuThumbsDown />
          </Button>
        </ButtonGroup>
        <div className="flex items-center gap-2">
          <Tooltip content="Comment" className='text-foreground'>
            <Button
              isIconOnly
              color="default"
              variant="light"
              size="sm"
              aria-label="Comment"
              className="hover:bg-default-100"
            >
              <LuMessageSquare className="text-foreground" />
            </Button>
          </Tooltip>
          <Tooltip
            content={
              isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'
            } className='text-foreground'
          >
            <Button
              isIconOnly
              color={isBookmarked ? 'warning' : 'default'}
              variant={isBookmarked ? 'solid' : 'light'}
              size="sm"
              aria-label={
                isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'
              }
              onClick={handleBookmark}
              className={isBookmarked ? '' : 'hover:bg-default-100'}
            >
              <LuBookmark
                className={isBookmarked ? 'text-white' : 'text-foreground'}
              />
            </Button>
          </Tooltip>
          <Tooltip content="Share this post" className='text-foreground'>
            <Button
              isIconOnly
              color="default"
              variant="light"
              size="sm"
              aria-label="Share this post"
              className="hover:bg-default-100"
            >
              <LuShare2 className="text-foreground" />
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;

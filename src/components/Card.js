"use client";
import Link from "next/link";
import { useState } from "react";
import {
  LuBookmark,
  LuMessageSquare,
  LuThumbsDown,
  LuThumbsUp,
  LuArrowDown,
  LuFlag,
  LuShare2,
} from "react-icons/lu";
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
  userId,
  postHeading,
  description,
  hashtags,
  postImage,
  createdAt,
  likeCount,
  postId,
  username,
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
    <Card className="bg-primary transition-shadow duration-300 hover:shadow-md w-full h-[500px] max-w-[400px] mx-auto flex flex-col">
      <CardHeader className="justify-between p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <Avatar src={profileImage} alt={username} size="sm" />

          <div className="flex flex-col items-start justify-center">
            <h4 className="text-xs sm:text-small font-semibold leading-none text-default-600 hover:underline truncate max-w-[150px]">
              {username}
            </h4>

            <h5 className="text-xs sm:text-small tracking-tight text-default-400">
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
      <CardBody className="px-3 sm:px-4 py-1 sm:py-2 text-small text-default-400 overflow-auto flex-grow">
        <Link href={`/post/${postId}`}>
          <h2 className="text-base sm:text-large font-bold text-default-600 transition-colors hover:text-primary-100 line-clamp-2">
            {postHeading}
          </h2>
        </Link>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm line-clamp-3">
          {description}
        </p>
        <div className="mt-1 sm:mt-2 flex flex-wrap gap-1">
          {hashtags.map((tag, index) => (
            <Link
              key={index}
              href={`/hashtag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Chip
                color="warning"
                variant="flat"
                size="sm"
                className="cursor-pointer hover:bg-primary-100 text-xs"
              >
                #{tag}
              </Chip>
            </Link>
          ))}
        </div>
        {postImage && (
          <div className="mt-2 h-[150px] w-full">
            <img
              alt="Post image"
              className="h-full w-full object-cover rounded-md"
              src={postImage}
            />
          </div>
        )}
      </CardBody>
      <CardFooter className="flex justify-between gap-2 sm:gap-3 p-3 sm:p-4 mt-auto">
        <ButtonGroup size="sm">
          <Button
            color={isLiked ? "success" : "default"}
            variant={isLiked ? "solid" : "flat"}
            aria-label="Like"
            onClick={handleLike}
            disableRipple
            size="sm"
          >
            <LuThumbsUp className="text-xs sm:text-sm" />
            <span className="ml-1 text-xs sm:text-sm">{likeCount}</span>
          </Button>
          <Button
            color={isDisliked ? "danger" : "default"}
            variant="flat"
            aria-label="Dislike"
            onClick={handleDislike}
            disableRipple
            isIconOnly
            size="sm"
          >
            <LuThumbsDown className="text-xs sm:text-sm" />
          </Button>
        </ButtonGroup>
        <div className="flex items-center gap-1 sm:gap-2">
          <Tooltip content="Comment" className="text-foreground">
            <Button
              isIconOnly
              color="default"
              variant="light"
              size="sm"
              aria-label="Comment"
              className="hover:bg-default-100"
            >
              <LuMessageSquare className="text-foreground text-xs sm:text-sm" />
            </Button>
          </Tooltip>
          <Tooltip
            content={
              isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
            }
            className="text-foreground"
          >
            <Button
              isIconOnly
              color={isBookmarked ? "warning" : "default"}
              variant={isBookmarked ? "solid" : "light"}
              size="sm"
              aria-label={
                isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
              }
              onClick={handleBookmark}
              className={isBookmarked ? "" : "hover:bg-default-100"}
            >
              <LuBookmark
                className={`${isBookmarked ? "text-white" : "text-foreground"} text-xs sm:text-sm`}
              />
            </Button>
          </Tooltip>
          <Tooltip content="Share this post" className="text-foreground">
            <Button
              isIconOnly
              color="default"
              variant="light"
              size="sm"
              aria-label="Share this post"
              className="hover:bg-default-100"
            >
              <LuShare2 className="text-foreground text-xs sm:text-sm" />
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;

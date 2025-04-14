"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  Button,
  Input,
  CardBody,
  CardHeader,
  Avatar,
  Card,
  Spinner,
} from "@heroui/react";
import {
  LuCamera,
  LuX,
  LuImage,
  LuUser,
  LuAtSign,
  LuLock,
  LuUserPlus,
  LuShieldCheck,
  LuCircleHelp,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { HUMOR_LINE_SWITCH_INTERVAL, SIGNUP_HUMOR_LINES } from "@/constants";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { account, ID, storage } from "@/appwrite";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username is too long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers and underscores allowed"
      ),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password is too long")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [humorLine, setHumorLine] = useState(SIGNUP_HUMOR_LINES[0]);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getRandomHumorLine = () => {
      const randomIndex = Math.floor(Math.random() * SIGNUP_HUMOR_LINES.length);
      return SIGNUP_HUMOR_LINES[randomIndex];
    };

    setHumorLine(getRandomHumorLine());

    const intervalId = setInterval(() => {
      setHumorLine(getRandomHumorLine());
    }, HUMOR_LINE_SWITCH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    setProfileImage(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover image must be less than 10MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleAvatarDelete = () => {
    setAvatarPreview(null);
    setProfileImage(null);
  };

  const handleCoverDelete = () => {
    setCoverPreview(null);
    setCoverImage(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create user account
      const user = await account.create(
        ID.unique(),
        data.email,
        data.password,
        data.username
      );

      // Upload profile image if provided
      let imageId = null;
      if (profileImage) {
        setLoadingImage(true);
        const response = await storage.createFile(
          process.env.NEXT_PUBLIC_BUCKET_ID,
          ID.unique(),
          profileImage,
          [`read("user:${user.$id}")`, `write("user:${user.$id}")`]
        );
        imageId = response.$id;
      }

      // Upload cover image if provided
      let coverId = null;
      if (coverImage) {
        const response = await storage.createFile(
          process.env.NEXT_PUBLIC_BUCKET_ID,
          ID.unique(),
          coverImage,
          [`read("user:${user.$id}")`, `write("user:${user.$id}")`]
        );
        coverId = response.$id;
      }

      // Update user preferences with image IDs
      const prefs = {};
      if (imageId) prefs.profileImageId = imageId;
      if (coverId) prefs.coverImageId = coverId;

      if (Object.keys(prefs).length > 0) {
        await account.updatePrefs(prefs);
      }

      // Log user in automatically
      await account.createEmailPasswordSession(data.email, data.password);

      toast.success(`Welcome, ${data.username}! Account created successfully.`);
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
      setLoadingImage(false);
    }
  };

  return (
    <Card className="pb-10 w-full bg-gradient-to-t from-primary to-warning/20 to-95% shadow-lg rounded-xl">
      <CardHeader className="flex flex-col items-center relative p-0">
        <div className="w-full h-40 bg-warning rounded-t-lg relative ">
          {coverPreview ? (
            <>
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover object-center rounded-t-lg"
              />
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                size="sm"
                className="absolute top-2 right-2 rounded-full"
                onClick={handleCoverDelete}
              >
                <LuX />
              </Button>
            </>
          ) : (
            <div className="group absolute inset-0 flex items-center justify-center cursor-pointer">
              <label
                htmlFor="cover-upload"
                className="cursor-pointer text-gray-600 group-hover:text-gray-800 w-full h-full flex items-center justify-center"
              >
                <LuImage size={24} />
                <span className="ml-2">Add cover photo</span>
              </label>
              <input
                id="cover-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif"
                onChange={handleCoverChange}
                className="hidden"
              />
            </div>
          )}
        </div>
        <div className="absolute -bottom-16 left-8 transform">
          <div className="relative">
            {avatarPreview ? (
              <Avatar src={avatarPreview} className="w-32 h-32 text-large" />
            ) : (
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
                <LuUser className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-warning rounded-full p-2 cursor-pointer"
            >
              <LuCamera className="w-6 h-6 text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            {avatarPreview && (
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                size="sm"
                className="absolute top-0 right-0 rounded-full"
                onClick={handleAvatarDelete}
              >
                <LuX />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-20 px-8">
        <h2 className="text-2xl font-bold text-foreground">Sign Up</h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={humorLine}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-1 text-sm text-gray-400 h-6"
          >
            {humorLine.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.03 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </AnimatePresence>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <Input
            type="text"
            label="Username"
            placeholder="Choose a username"
            description="3-20 characters, letters, numbers and underscores"
            {...register("username")}
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
            startContent={
              <LuUser className="text-default-400 pointer-events-none flex-shrink-0" />
            }
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            autoComplete="username"
          />
          <Input
            type="email"
            label="Email address"
            placeholder="Enter your email"
            {...register("email")}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            startContent={
              <LuAtSign className="text-default-400 pointer-events-none flex-shrink-0" />
            }
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            autoComplete="email"
          />
          <Input
            type={passwordVisible ? "text" : "password"}
            label="Password"
            placeholder="Create a password"
            description="At least 8 characters with uppercase, lowercase and number"
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            startContent={
              <LuLock className="text-default-400 pointer-events-none flex-shrink-0" />
            }
            endContent={
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="focus:outline-none"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                <LuCircleHelp className="text-default-400" />
              </button>
            }
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            autoComplete="new-password"
          />
          <Input
            type={passwordVisible ? "text" : "password"}
            label="Confirm Password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            startContent={
              <LuShieldCheck className="text-default-400 pointer-events-none flex-shrink-0" />
            }
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            color="warning"
            className="w-full"
            isDisabled={!isValid || loading}
            isLoading={loading || loadingImage}
          >
            {loading || loadingImage ? (
              <Spinner size="sm" color="white" />
            ) : (
              <>
                Create Account <LuUserPlus className="ml-2" />
              </>
            )}
          </Button>
        </form>
        <div className="mt-4 text-right">
          <Link href="/signin" className="text-sm text-warning hover:underline">
            Already have an account?
          </Link>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-warning hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-warning hover:underline">
            Privacy Policy
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}

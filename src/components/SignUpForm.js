"use client";

import { useEffect, useState, useCallback } from "react";
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
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

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_COVER_SIZE = 10 * 1024 * 1024; // 10MB

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
    email: z.string().email("Please enter a valid email address").min(1),
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
    formState: { errors },
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState("terms");

  const getRandomHumorLine = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SIGNUP_HUMOR_LINES.length);
    return SIGNUP_HUMOR_LINES[randomIndex];
  }, []);

  useEffect(() => {
    setHumorLine(getRandomHumorLine());
    const intervalId = setInterval(() => {
      setHumorLine(getRandomHumorLine());
    }, HUMOR_LINE_SWITCH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [getRandomHumorLine]);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const isAvatar = type === "avatar";
    const maxSize = isAvatar ? MAX_AVATAR_SIZE : MAX_COVER_SIZE;
    const sizeError = isAvatar
      ? "Image must be less than 5MB"
      : "Cover image must be less than 10MB";

    if (file.size > maxSize) {
      toast.error(sizeError);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    if (isAvatar) {
      setProfileImage(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarChange = (e) => handleImageChange(e, "avatar");
  const handleCoverChange = (e) => handleImageChange(e, "cover");

  const handleImageDelete = (type) => {
    if (type === "avatar") {
      setAvatarPreview(null);
      setProfileImage(null);
    } else {
      setCoverPreview(null);
      setCoverImage(null);
    }
  };

  const handleAvatarDelete = () => handleImageDelete("avatar");
  const handleCoverDelete = () => handleImageDelete("cover");

  const uploadFile = async (file, name) => {
    return await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID,
      name,
      file,
      ['read("any")', 'write("any")']
    );
  };

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const user = await account.create(
        ID.unique(),
        data.email,
        data.password,
        data.username
      );

      await account.createEmailPasswordSession(data.email, data.password);

      const uploadPromises = [];
      let imageId = null;
      let coverId = null;

      if (profileImage) {
        setLoadingImage(true);
        uploadPromises.push(
          uploadFile(profileImage, `${data.username}-avatar`).then((res) => {
            imageId = res.$id;
          })
        );
      }

      if (coverImage) {
        uploadPromises.push(
          uploadFile(coverImage, `${data.username}-cover`).then((res) => {
            coverId = res.$id;
          })
        );
      }

      await Promise.all(uploadPromises);

      const prefs = {};
      if (imageId) prefs.profileImageId = imageId;
      if (coverId) prefs.coverImageId = coverId;

      if (Object.keys(prefs).length > 0) {
        await account.updatePrefs(prefs);
      }

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

  const openTermsModal = () => {
    setActiveTab("terms");
    onOpen();
  };

  const openPrivacyModal = () => {
    setActiveTab("privacy");
    onOpen();
  };

  return (
    <>
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
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
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
            <Link
              href="/signin"
              className="text-sm text-warning hover:underline"
            >
              Already have an account?
            </Link>
          </div>

          <p className="mt-10 text-center text-xs text-gray-400">
            By signing up, you agree to our{" "}
            <button
              onClick={openTermsModal}
              className="text-warning hover:underline"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              onClick={openPrivacyModal}
              className="text-warning hover:underline"
            >
              Privacy Policy
            </button>
          </p>
        </CardBody>
      </Card>

      {/* Terms and Privacy Policy Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Legal Information
          </ModalHeader>
          <ModalBody>
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={setActiveTab}
              color="warning"
              variant="underlined"
              classNames={{
                tabList: "gap-6",
                cursor: "w-full bg-warning",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-warning",
              }}
            >
              <Tab key="terms" title="Terms of Service">
                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                  <h2>Terms of Service</h2>
                  <p>Last updated: {new Date().toLocaleDateString()}</p>

                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By accessing or using DevHive, you agree to be bound by
                    these Terms of Service. If you do not agree to these terms,
                    please do not use our platform.
                  </p>

                  <h3>2. User Accounts</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities that occur
                    under your account. You must immediately notify us of any
                    unauthorized use of your account.
                  </p>

                  <h3>3. User Content</h3>
                  <p>
                    You retain ownership of any content you post on DevHive. By
                    posting content, you grant us a non-exclusive, royalty-free
                    license to use, display, and distribute your content in
                    connection with the service.
                  </p>

                  <h3>4. Prohibited Conduct</h3>
                  <p>You agree not to:</p>
                  <ul>
                    <li>
                      Post content that is illegal, harmful, threatening,
                      abusive, or otherwise objectionable
                    </li>
                    <li>Impersonate any person or entity</li>
                    <li>Use the platform for any illegal purpose</li>
                    <li>
                      Attempt to gain unauthorized access to other user accounts
                      or system components
                    </li>
                    <li>
                      Engage in any activity that interferes with or disrupts
                      the service
                    </li>
                  </ul>

                  <h3>5. Termination</h3>
                  <p>
                    We reserve the right to terminate or suspend your account at
                    our sole discretion, without notice, for conduct that we
                    believe violates these Terms of Service or is harmful to
                    other users, us, or third parties.
                  </p>

                  <h3>6. Changes to Terms</h3>
                  <p>
                    We may modify these terms at any time. Your continued use of
                    DevHive after any changes indicates your acceptance of the
                    modified terms.
                  </p>
                </div>
              </Tab>
              <Tab key="privacy" title="Privacy Policy">
                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                  <h2>Privacy Policy</h2>
                  <p>Last updated: {new Date().toLocaleDateString()}</p>

                  <h3>1. Information We Collect</h3>
                  <p>
                    We collect information you provide directly to us when you
                    create an account, update your profile, or interact with
                    features on our platform. This may include your name, email
                    address, username, profile picture, and any content you
                    post.
                  </p>

                  <h3>2. How We Use Your Information</h3>
                  <p>We use the information we collect to:</p>
                  <ul>
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>
                      Send technical notices, updates, security alerts, and
                      support messages
                    </li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>
                      Monitor and analyze trends, usage, and activities in
                      connection with our services
                    </li>
                  </ul>

                  <h3>3. Information Sharing</h3>
                  <p>
                    We do not share your personal information with third parties
                    except in the following circumstances:
                  </p>
                  <ul>
                    <li>With your consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights, privacy, safety, or property</li>
                    <li>
                      In connection with a merger, sale of assets, or other
                      business transfer
                    </li>
                  </ul>

                  <h3>4. Data Security</h3>
                  <p>
                    We take reasonable measures to help protect your personal
                    information from loss, theft, misuse, and unauthorized
                    access, disclosure, alteration, and destruction.
                  </p>

                  <h3>5. Your Choices</h3>
                  <p>
                    You can access, update, or delete your account information
                    at any time through your account settings. You may also
                    contact us directly to request access to, correction of, or
                    deletion of personal information.
                  </p>

                  <h3>6. Changes to Privacy Policy</h3>
                  <p>
                    We may change this privacy policy from time to time. If we
                    make changes, we will notify you by revising the date at the
                    top of the policy.
                  </p>
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

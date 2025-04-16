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
  Card,
  Divider,
  Spinner,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  LuGithub,
  LuAtSign,
  LuLock,
  LuLogIn,
  LuCircleHelp,
} from "react-icons/lu";
import { HUMOR_LINE_SWITCH_INTERVAL, SIGNIN_HUMOR_LINES } from "@/constants";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { account } from "@/appwrite";

const schema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password is too long"),
});

export default function SigninForm() {
  const router = useRouter();
  const [humorLine, setHumorLine] = useState(SIGNIN_HUMOR_LINES[0]);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  useEffect(() => {
    const getRandomHumorLine = () => {
      const randomIndex = Math.floor(Math.random() * SIGNIN_HUMOR_LINES.length);
      return SIGNIN_HUMOR_LINES[randomIndex];
    };

    setHumorLine(getRandomHumorLine());

    const intervalId = setInterval(() => {
      setHumorLine(getRandomHumorLine());
    }, HUMOR_LINE_SWITCH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const handleOAuthSignIn = async (provider) => {
    try {
      await account.createOAuth2Session(
        provider,
        `${window.location.origin}/`,
        `${window.location.origin}/signin`
      );
      toast.success(
        `Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
      );
    } catch (error) {
      toast.error(
        error?.message ||
          `Unable to sign in with ${provider}. Please try again.`
      );
      console.error(`${provider} sign-in error:`, error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Clear any existing session
      try {
        await account.deleteSession("current");
      } catch (error) {}

      await account.createEmailPasswordSession(data.email, data.password);
      const user = await account.get();

      toast.success(`Welcome back, ${user.name}!`);
      router.push("/");
    } catch (err) {
      toast.error(
        err.message || "Invalid email or password. Please try again."
      );
      setError("email", {
        type: "manual",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 ">
      <Card className="w-full max-w-md mx-auto p-3 sm:p-4">
        <CardHeader className="flex flex-col items-center pb-0">
          <h1 className="text-xl sm:text-2xl font-bold text-warning">Welcome Back!</h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={humorLine}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm text-center text-foreground/70 mt-2"
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
        </CardHeader>
        <CardBody>
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            <p className="font-semibold text-warning">Continue With</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
              <Button
                fullWidth
                variant="flat"
                onClick={() => handleOAuthSignIn("google")}
                startContent={<FcGoogle className="text-lg sm:text-xl" />}
                className="font-medium"
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="flat"
                onClick={() => handleOAuthSignIn("github")}
                startContent={<LuGithub className="text-lg sm:text-xl" />}
                className="font-medium"
              >
                GitHub
              </Button>
            </div>
          </div>
          <div className="relative">
            <Divider className="my-6 sm:my-8" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-content1 px-2 text-xs sm:text-sm text-foreground/50">
              Or
            </span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
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
              classNames={{ inputWrapper: "border border-default-200" }}
              autoComplete="email"
              size="sm"
              className="text-sm sm:text-base"
            />
            <Input
              type={passwordVisible ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
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
                  {passwordVisible ? (
                    <LuCircleHelp className="text-default-400" />
                  ) : (
                    <LuCircleHelp className="text-default-400" />
                  )}
                </button>
              }
              classNames={{ inputWrapper: "border border-default-200" }}
              autoComplete="current-password"
              size="sm"
              className="text-sm sm:text-base"
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm text-warning hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              color="warning"
              className="text-primary"
              isDisabled={!isValid || loading}
              isLoading={loading}
              fullWidth
              size="md"
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <>
                  Sign In <LuLogIn className="ml-2" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-3 sm:mt-4 text-center">
            <span className="text-xs sm:text-sm text-foreground/70">
              Don't have an account?{" "}
            </span>
            <Link href="/signup" className="text-xs sm:text-sm text-warning hover:underline">
              Sign up
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

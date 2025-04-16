"use client";
import React from "react";
import AddPostForm from "@/components/add-post/AddPostForm";
import { Card, CardBody } from "@heroui/react";
import { Toaster } from "react-hot-toast";

export default function AddPost() {
  return (
    <div className="min-h-screen bg-primary py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <Toaster position="top-center" />
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardBody className="p-4 sm:p-6 md:p-8">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 text-foreground">
              Create New Post
            </h2>
            <p className="text-sm sm:text-base text-foreground-500">
              Share your knowledge, experiences, or questions with the
              community.
            </p>
            <AddPostForm />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

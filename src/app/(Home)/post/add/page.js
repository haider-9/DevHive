"use client";
import React from "react";
import AddPostForm from "@/components/add-post/AddPostForm";
import { Card, CardBody } from "@heroui/react";
import { Toaster } from "react-hot-toast";

export default function AddPost() {
  return (
    <div className="min-h-screen bg-primary py-8">
      <Toaster position="top-center" />
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardBody className="p-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              Create New Post
            </h2>
            <p className="text-foreground-500">
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

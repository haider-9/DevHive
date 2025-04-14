import AddPostForm from "@/components/add-post/AddPostForm";
import { Card, CardBody } from "@heroui/react";

export default function AddPost() {
  return (
    <Card className="m-10 p-8 max-w-2xl mx-auto">
      <CardBody>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            Create New Post
          </h2>
          <AddPostForm />
        </div>
      </CardBody>
    </Card>
  );
}
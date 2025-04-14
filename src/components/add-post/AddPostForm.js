"use client";

import { useRef, useState } from "react";
import { Input, Button, Textarea, Chip } from "@heroui/react";
import { LuCamera, LuHeading, LuText, LuUpload, LuHash, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import ContentTabs from "./ContentTabs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().min(1, "Summary is required"),
    image: z.any().optional(),
    tags: z.array(z.string()),
    content: z.string().min(1, "Content is required"),
});

export default function AddPostForm() {
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            summary: "",
            image: null,
            tags: [],
            content: "",
        },
    });

    const [currentTag, setCurrentTag] = useState("");
    const tagInputRef = useRef(null);
    const tags = watch("tags");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setValue("image", URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setValue("image", null);
    };

    const onSubmit = (data) => {
        console.log(data);
        // TODO: Implement post creation logic
    };

    const handleTagKeyDown = (event) => {
        if (event.key === 'Enter' && currentTag.trim()) {
            event.preventDefault();
            const newTag = currentTag.trim();
            if (tags.includes(newTag)) {
                toast.error("Tag already exists", {
                    id: "tag-error",
                });
                return;
            }
            setValue("tags", [...tags, newTag]);
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove) => {
        setValue("tags", tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div
                className="mb-14 w-full max-w-sm h-40 flex justify-center items-center cursor-pointer transition-colors overflow-hidden border-2 border-secondary rounded-3xl relative"
            >
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                />
                {watch("image") ? (
                    <>
                        <img src={watch("image")} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                        <Button
                            isIconOnly
                            color="warning"
                            variant="flat"
                            aria-label="Remove image"
                            className="absolute top-2 right-2 rounded-full"
                            onClick={handleRemoveImage}
                        >
                            <LuTrash2 />
                        </Button>
                    </>
                ) : (
                    <div className="text-sm text-center flex items-center gap-3">
                        <LuCamera className="mx-auto text-3xl text-warning" />
                        <p className="text-warning">Preview Image</p>
                    </div>
                )}
            </div>

            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        label="Title"
                        placeholder="Enter post title"
                        startContent={<LuHeading className="text-foreground" />}
                        isInvalid={!!errors.title}
                        errorMessage={errors.title?.message}
                    />
                )}
            />

            <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        label="Summary"
                        placeholder="Write a brief summary of your post"
                        minRows={4}
                        startContent={<LuText className="text-foreground" />}
                        isInvalid={!!errors.summary}
                        errorMessage={errors.summary?.message}
                    />
                )}
            />

            <Controller
                name="content"
                control={control}
                render={({ field }) => (
                    <ContentTabs
                        content={field.value}
                        setContent={field.onChange}
                        error={errors.content?.message}
                    />
                )}
            />

            <Input
                label="Tags"
                placeholder="Enter tags and press Enter"
                onKeyDown={handleTagKeyDown}
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                startContent={<LuHash className="text-foreground" />}
                description="Add relevant hashtags to categorize your post"
                ref={tagInputRef}
            />

            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <Chip key={index} onClose={() => removeTag(tag)} variant="flat" color="warning" startContent={<LuHash />}>
                        {tag}
                    </Chip>
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    color="warning"
                    variant="flat"
                    size="lg"
                    className="w-full max-w-xs text-info"
                    type="submit"
                    startContent={<LuUpload className="text-xl" />}
                >
                    Publish Post
                </Button>
            </div>
        </form>
    );
}
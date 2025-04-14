"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, databases, storage, ID, DATABASE_ID, POST_COLLECTION_ID } from "@/appwrite";
import { toast, Toaster } from "react-hot-toast";

const AddPostForm = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Please sign in to create a post");
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
      setPostData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setPostData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!postData.title.trim() || !postData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSubmitting(true);
    try {
      let coverImageId = null;
      let coverImageUrl = null;

      // Upload cover image if selected
      if (coverImage) {
        const fileId = ID.unique();
        await storage.createFile(
          process.env.NEXT_PUBLIC_BUCKET_ID, 
          fileId,
          coverImage
        );
        
        coverImageId = fileId;
        coverImageUrl = storage.getFileView(
          process.env.NEXT_PUBLIC_BUCKET_ID,
          fileId
        ).href;
      }

      // Create post document
      const post = await databases.createDocument(
        DATABASE_ID,
        POST_COLLECTION_ID, 
        ID.unique(),
        {
          title: postData.title,
          content: postData.content,
          tags: postData.tags,
          coverImageId: coverImageId,
          coverImageUrl: coverImageUrl,
          authorId: user.$id,
          authorName: user.name,
          authorEmail: user.email,
          createdAt: new Date().toISOString(),
        }
      );

      toast.success("Post created successfully!");
      router.push(`/post/${post.$id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-warning"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Toaster position="top-center" />
      
      {/* Cover Image */}
      <div className="space-y-2">
        <label className="block text-lg font-medium">Cover Image</label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => document.getElementById('cover-image').click()}
        >
          {imagePreview ? (
            <div className="relative h-48 w-full">
              <img 
                src={imagePreview} 
                alt="Cover preview" 
                className="h-full w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCoverImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Click to upload a cover image</p>
            </div>
          )}
          <input
            id="cover-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-lg font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={postData.title}
          onChange={handleChange}
          placeholder="Enter a descriptive title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning focus:border-warning"
          required
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="block text-lg font-medium">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={postData.content}
          onChange={handleChange}
          placeholder="Write your post content here..."
          rows="10"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning focus:border-warning"
          required
        ></textarea>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="block text-lg font-medium">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {postData.tags.map((tag, index) => (
            <div
              key={index}
              className="bg-warning bg-opacity-20 text-warning px-3 py-1 rounded-full flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-warning hover:text-danger"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-warning focus:border-warning"
            placeholder="Add a tag (e.g., JavaScript, React, Tutorial)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-warning hover:bg-warning-dark text-white px-4 py-2 rounded-r-md transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-warning text-white rounded-md hover:bg-warning-dark disabled:opacity-50 transition-colors flex items-center"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </>
          ) : (
            "Publish Post"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddPostForm;

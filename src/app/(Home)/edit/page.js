"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, storage, ID } from "@/appwrite";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { Spinner } from "@heroui/react";

const BUCKET_ID = process.env.NEXT_PUBLIC_BUCKET_ID;

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    skills: [],
    github: "",
    linkedin: "",
    website: "",
    profileImage: "",
    coverImage: "", // New field for cover image
  });
  const [newSkill, setNewSkill] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        // Get user preferences
        const prefs = currentUser.prefs;

        setProfileData({
          name: currentUser.name || "",
          bio: prefs.bio || "",
          skills: prefs.skills ? JSON.parse(prefs.skills) : [],
          github: prefs.github || "",
          linkedin: prefs.linkedin || "",
          website: prefs.website || "",
          profileImage: prefs.profileImage || "",
          coverImage: prefs.coverImage || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Please Log in to EditProfile");
        router.push("/signin");
      }
    };

    fetchUserData();
  }, [router]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image change
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new skill
  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  // Remove a skill
  const removeSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      let profileImageUrl = profileData.profileImage;
      let coverImageUrl = profileData.coverImage;

      // Upload profile image if selected
      if (imageFile) {
        const fileId = ID.unique();
        await storage.createFile(BUCKET_ID, fileId, imageFile);
        const fileUrl = storage.getFileView(BUCKET_ID, fileId);
        profileImageUrl = fileUrl.href;
      }

      // Upload cover image if selected
      if (coverFile) {
        const fileId = ID.unique();
        await storage.createFile(BUCKET_ID, fileId, coverFile);
        const fileUrl = storage.getFileView(BUCKET_ID, fileId);
        coverImageUrl = fileUrl.href;
      }

      // Update account and preferences
      await account.updateName(profileData.name);
      await account.updatePrefs({
        bio: profileData.bio,
        skills: JSON.stringify(profileData.skills),
        github: profileData.github,
        linkedin: profileData.linkedin,
        website: profileData.website,
        profileImage: profileImageUrl,
        coverImage: coverImageUrl, // Save cover image URL
        updatedAt: new Date().toISOString(),
      });

      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
      <Spinner size="lg" color="warning" />
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-foreground">
      <div className="max-w-4xl mx-auto pb-12">
        {/* Cover Photo Section */}
        <div className="relative h-48 bg-secondary rounded-t-lg overflow-hidden">
          {coverPreview || profileData.coverImage ? (
            <img
              src={coverPreview || profileData.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-warning to-danger flex items-center justify-center">
              <span className="text-foreground text-lg font-medium">
                Add a cover photo
              </span>
            </div>
          )}

          <label className="absolute bottom-4 right-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-foreground bg-black bg-opacity-50 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning cursor-pointer">
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            Change Cover
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
        </div>

        {/* Profile Content */}
        <div className="bg-secondary shadow rounded-b-lg">
          {/* Profile Picture */}
          <div className="px-6">
            <div className="flex -mt-16 mb-4">
              <div className="relative h-32 w-32 rounded-full border-4 border-primary bg-secondary shadow-lg">
                {imagePreview || profileData.profileImage ? (
                  <img
                    src={imagePreview || profileData.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-warning flex items-center justify-center">
                    <span className="text-foreground font-medium text-4xl">
                      {profileData.name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full shadow-md border border-warning cursor-pointer hover:bg-secondary">
                  <svg
                    className="h-5 w-5 text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <form
            onSubmit={handleSubmit}
            className="divide-y divide-foreground-500"
          >
            {/* Basic Info */}
            <div className="px-6 py-5">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-foreground">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-foreground-500 rounded-md shadow-sm py-2 px-3 bg-primary text-foreground focus:outline-none focus:ring-warning focus:border-warning sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-foreground">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-foreground-500 rounded-md shadow-sm py-2 px-3 bg-primary text-foreground focus:outline-none focus:ring-warning focus:border-warning sm:text-sm"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="px-6 py-5">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning text-foreground"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-foreground hover:bg-danger hover:text-foreground focus:outline-none"
                    >
                      <span className="sr-only">Remove skill</span>
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M1 1l6 6m0-6L1 7"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-foreground-500 bg-primary text-foreground focus:outline-none focus:ring-warning focus:border-warning sm:text-sm"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-foreground bg-warning hover:bg-danger focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="px-6 py-5">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Social Links
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    GitHub
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-foreground-500 bg-secondary text-foreground-500 sm:text-sm">
                      github.com/
                    </span>
                    <input
                      type="text"
                      name="github"
                      value={profileData.github.replace(
                        "https://github.com/",
                        ""
                      )}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          github: `https://github.com/${e.target.value}`,
                        })
                      }
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-foreground-500 bg-primary text-foreground focus:outline-none focus:ring-warning focus:border-warning sm:text-sm"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    LinkedIn
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-foreground-500 bg-secondary text-foreground-500 sm:text-sm">
                      linkedin.com/in/
                    </span>
                    <input
                      type="text"
                      name="linkedin"
                      value={profileData.linkedin.replace(
                        "https://linkedin.com/in/",
                        ""
                      )}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          linkedin: `https://linkedin.com/in/${e.target.value}`,
                        })
                      }
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-foreground-500 bg-primary text-foreground focus:outline-none focus:ring-warning focus:border-warning sm:text-sm"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-foreground-500 rounded-md shadow-sm py-2 px-3 bg-primary text-foreground focus:outline-none focus:ring-warning focus:border-warning sm:text-sm"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-secondary text-right">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-primary py-2 px-4 border border-foreground-500 rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-foreground bg-warning hover:bg-danger focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

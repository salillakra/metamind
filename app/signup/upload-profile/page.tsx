"use client";

import Logo from "@components/Logo";
import Spinner from "@components/Spinner";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { updateProfileImg } from "@/auth/signup";
import { useStore } from "@tanstack/react-store";
import { userIdStore } from "@/store/Signup";
import { toast } from "sonner";

// Define interfaces for Cloudinary
interface CloudinaryInfo {
  secure_url: string;
  public_id: string;
  [key: string]: string | number | boolean;
}

const ProfileUploadPage: React.FC = () => {
  const [bio, setBio] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const user = useStore(userIdStore, (state) => state.id);

  if (!user) {
    return redirect("/signup");
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!uploadedUrl || !user) {
        toast.error("Please upload a profile picture");
        setLoading(false);
        return;
      }

      const res = await updateProfileImg(user, uploadedUrl, bio);
      if (res.success) {
        toast.success("Profile picture updated!");
        router.push("/signin");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 text-white">
      {(uploading || loading) && <Spinner />}
      <div className="absolute top-5 left-5">
        <Logo />
      </div>
      <h1 className="text-xl sm:text-3xl font-bold mb-6 text-center">
        Upload Your Profile Picture
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-8 w-full max-w-md"
      >
        <div className="relative h-40 w-40 md:w-64 md:h-64 shadow-lg rounded-full overflow-hidden border-4 border-white">
          {uploadedUrl && (
            <Image
              height={300}
              width={300}
              className="h-full w-full object-cover"
              src={uploadedUrl}
              alt="Profile Preview"
            />
          )}

          <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={(result, { widget }) => {
              const info = result?.info as CloudinaryInfo;
              if (info?.secure_url) {
                setUploadedUrl(info.secure_url);
              }
              setUploading(false);
              widget.close();
            }}
            onQueuesStart={() => setUploading(true)}
            options={{
              // This mode allows unsigned uploads when using the appropriate preset
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              uploadPreset:
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                "ml_default",
            }}
          >
            {({ open }) => {
              function handleOnClick() {
                open();
              }
              return (
                <label
                  onClick={handleOnClick}
                  className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full flex justify-center items-center cursor-pointer transition duration-300"
                >
                  <Upload
                    size={50}
                    className="text-gray-100 group-hover:text-gray-300"
                  />
                </label>
              );
            }}
          </CldUploadWidget>
        </div>
        <textarea
          onChange={(e) => setBio(e.target.value)}
          className="w-full h-32 p-4 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Tell us about yourself..."
        />
        <Button
          type="submit"
          className="w-36 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Upload
        </Button>
      </form>
    </div>
  );
};

export default ProfileUploadPage;

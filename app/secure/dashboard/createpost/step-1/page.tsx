"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderIcon, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/app/components/Spinner";
import { CurrentPost } from "@/store/CurrentPost";
import { Textarea } from "@/components/ui/textarea";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import StepIndicator from "@/app/components/StepIndicator";
import {
  restorePostFromLocalStorage,
  savePostToLocalStorage,
} from "@/lib/localStorageUtils";

// Define interfaces for Cloudinary
interface CloudinaryInfo {
  secure_url: string;
  public_id: string;
  [key: string]: string | number | boolean;
}

const categories: [string, ...string[]] = [
  "Technology",
  "Health",
  "Science",
  "Education",
  "Entertainment",
  "Sports",
  "Business",
  "Travel",
  "Lifestyle",
  "Food",
  "Fashion",
  "Art",
  "Politics",
  "Environment",
  "History",
  "Culture",
  "Finance",
  "Music",
  "Literature",
  "Gaming",
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required").nonempty("Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .nonempty("Description is required"),
  category: z.enum(categories, { required_error: "Category is required" }),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  // Try to restore the saved post data when component mounts
  useEffect(() => {
    if (restorePostFromLocalStorage()) {
      const savedPost = CurrentPost.state;

      // Populate the form with the saved data
      form.setValue("title", savedPost.title);
      form.setValue("description", savedPost.description || "");
      // Make sure the value is valid before setting
      if (savedPost.category && categories.includes(savedPost.category)) {
        form.setValue(
          "category",
          savedPost.category as (typeof categories)[number]
        );
      }

      // Set the image URL if available
      if (savedPost.imageURL) {
        setUploadedUrl(savedPost.imageURL);
      }

      toast({
        title: "Draft Restored",
        description: "Your previous post draft has been restored",
      });
    }
  }, [form, toast]);

  //onSubmit to update the store with the post details
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be signed in to create a post",
      });
      return false;
    }

    // Update the CurrentPost store with the Post details
    CurrentPost.setState((state) => {
      return {
        ...state,
        authorId: user.id,
        title: values.title,
        category: values.category,
        description: values.description,
        imageURL: uploadedUrl || "",
      };
    });

    // Save to localStorage
    savePostToLocalStorage();

    toast({
      title: "Details Saved",
      description: "Moving to the next step",
    });

    router.push("/secure/dashboard/createpost/step-2");
  }

  return (
    <div className="min-h-[90vh] py-5 overflow-y-auto">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl px-4">
          <StepIndicator currentStep={1} />

          <div className="bg-card rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create New Post
            </h2>

            {uploading && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
                  <Spinner />
                  <p className="mt-4 font-medium">Uploading image...</p>
                </div>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                {/* Cloudinary Upload Widget Area */}
                <div className="flex items-center justify-center w-full">
                  {uploadedUrl ? (
                    <div className="relative w-full">
                      <div
                        className="bg-red-500 absolute grid place-items-center -right-4 top-0 h-8 w-8 rounded-[100%] cursor-pointer"
                        onClick={() => {
                          setUploadedUrl("");
                          // Update store when image is removed
                          CurrentPost.setState((state) => ({
                            ...state,
                            imageURL: "",
                          }));
                          savePostToLocalStorage();
                        }}
                      >
                        <X size={"lg"} />
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Image
                          src={uploadedUrl}
                          height={300}
                          width={400}
                          alt="Preview"
                          className="h-64 w-full object-cover rounded-md"
                        />
                      </div>
                    </div>
                  ) : (
                    <CldUploadWidget
                      signatureEndpoint="/api/sign-cloudinary-params"
                      onSuccess={(result, { widget }) => {
                        const info = result?.info as CloudinaryInfo;
                        if (info?.secure_url) {
                          setUploadedUrl(info.secure_url);

                          // Update the state with the new image URL
                          CurrentPost.setState((state) => ({
                            ...state,
                            imageURL: info.secure_url,
                          }));

                          // Save to localStorage
                          savePostToLocalStorage();
                        }
                        setUploading(false);
                        widget.close();
                      }}
                      onQueuesStart={() => setUploading(true)}
                      options={{
                        cloudName:
                          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                        uploadPreset:
                          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                          "ml_default",
                      }}
                    >
                      {({ open }) => (
                        <div
                          onClick={() => open()}
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="my-1" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              image for your post
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF
                            </p>
                          </div>
                        </div>
                      )}
                    </CldUploadWidget>
                  )}
                </div>

                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write here..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short description about your post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category Select */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <Label>Category</Label>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  )}
                />

                <Button
                  size={"default"}
                  className="inline-block w-1/3 mx-auto mt-4"
                  type="submit"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoaderIcon className="animate-spin" />
                      <span className="ml-2">Saving...</span>
                    </div>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authenticateUser } from "@/auth/signin";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Logo from "@components/Logo";
import Spinner from "@components/Spinner";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const value = await authenticateUser(values.email, values.password);
      if (value) {
        toast.success("You are now logged in");
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/secure/dashboard");
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex relative justify-center items-center h-screen">
      {isLoading && <Spinner />}
      <div className="absolute top-5 left-5 ">
        <Logo />
      </div>
      <div className=" w-full mx-3  md:w-96 flex flex-col ">
        <h1 className="text-3xl  mb-8">
          Welcome Back{" "}
          <span
            className=" 
        bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            Dear
          </span>
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. yourname@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" /> Signing in
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* not registered */}
            <p className="text-center">
              Not registered?{" "}
              <Link href="/signup" className="text-blue-500">
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e?.preventDefault();
    setEmail("");
    toast.success("you've been subscribed");
  };
  return (
    <div className="rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-8 shadow-lg">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
          <Mail className="h-6 w-6 text-indigo-400" />
        </div>

        <h3 className="mb-2 text-2xl font-bold text-white">Stay in the loop</h3>
        <p className="mb-6 text-gray-300">
          Get the latest articles, resources, and insights delivered directly to
          your inbox.
        </p>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className="border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
          />
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Subscribe
          </Button>
        </form>

        <p className="mt-3 text-xs text-gray-400">
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;

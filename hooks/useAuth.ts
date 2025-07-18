"use client";

import { User } from "@prisma/client";
import { useEffect, useState } from "react";

const getUser = async () => {
  const response = await fetch("/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error(`Failed to get user: ${response.status}`);
    throw new Error(`Failed to get user: ${response.status}`);
  }
  const user = await response.json();
  console.log("Fetched user:", user);
  return user.payload;
};

export const useAuth = (): { user: User | null; loading: boolean } => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const asyncEffect = async () => {
    await getUser()
      .then((user) => {
        setUser(user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in asyncEffect:", error);
        setLoading(false);
      });
  };
  useEffect(() => {
    asyncEffect();
  }, []);

  return { user, loading };
};

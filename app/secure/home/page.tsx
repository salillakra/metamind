"use client";

import { Pen, StickyNote } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

const Dashboard = () => {
  const [data, setData] = useState<User>();
  const [loading, setLoading] = useState(true);
  const getUser = async () => {
    const response = await fetch("/api/user", { method: "GET" });
    if (response.ok) {
      setLoading(false);
      const user = await response.json();
      setData(user);
    } else {
      console.error("Failed to get user");
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>hi page</div>
  );
};

export default Dashboard;

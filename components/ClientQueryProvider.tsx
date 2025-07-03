"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ClientQueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ClientQueryProvider;

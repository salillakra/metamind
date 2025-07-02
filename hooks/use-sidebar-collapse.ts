"use client";

import { useState, useEffect } from "react";

export function useSidebarCollapse(defaultValue = false) {
  // We need to use a state variable instead of directly reading from localStorage
  // because localStorage is not available during server-side rendering
  const [isCollapsed, setIsCollapsed] = useState(defaultValue);

  // On component mount, we check if we have a saved preference
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(savedState === savedState);
    }
  }, []);

  // Update localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  return {
    isCollapsed,
    toggleCollapse: () => setIsCollapsed((prev) => !prev),
    expand: () => setIsCollapsed(false),
    collapse: () => setIsCollapsed(true),
  };
}

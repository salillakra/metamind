"use client";

import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Pen,
  StickyNote,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Logo from "@components/Logo";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@components/Spinner";
import { DropdownMenuprofile } from "@components/DropdownMenuprofile";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse";
import { ThemeToggle } from "@components/tiptap-templates/simple/theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const [isOpen, setOpen] = useState<boolean>(false);
  const {
    isCollapsed: isSidebarCollapsed,
    toggleCollapse: setSidebarCollapsed,
  } = useSidebarCollapse(false);
  const pathname = usePathname();

  // Set active menu based on current path
  const getActiveIndex = useCallback(() => {
    if (pathname.includes("/myposts")) return 0;
    if (pathname.includes("/createpost")) return 1;
    return null;
  }, [pathname]);

  const [activeIndex, setActiveIndex] = useState<number | null>(
    getActiveIndex()
  );

  useEffect(() => {
    setActiveIndex(getActiveIndex());
  }, [getActiveIndex]);

  const menuItems = [
    {
      icon: <StickyNote size={18} />,
      label: "My Posts",
      href: "/secure/dashboard/myposts",
    },
    {
      icon: <Pen size={18} />,
      label: "Create Post",
      href: "/secure/dashboard/createpost/step-1",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card shadow-sm border-b">
        <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!isOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-foreground" />
            </button>
            <Logo />
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm font-medium text-muted-foreground">
                Welcome, {user.firstName || "User"}
              </span>
              <DropdownMenuprofile userData={user} />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden="true"
              />
              <motion.div
                className="fixed top-0 left-0 h-full w-72 bg-card p-6 shadow-lg overflow-y-auto border-r"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <Logo />
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                    }}
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="sr-only">Close menu</span>
                    <X size={18} className="text-muted-foreground" />
                  </motion.button>
                </div>

                {user && (
                  <>
                    <div className="mb-8 pb-6 border-b">
                      <motion.div
                        className="flex items-center gap-4 py-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-base">
                          {user.firstName?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {`${user.firstName || ""} ${user.lastName || ""}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}

                <nav className="space-y-1.5">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          activeIndex === index
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                        onClick={() => {
                          setActiveIndex(index);
                          setOpen(false);
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
              <div className="absolute p-1 dark:hover:bg-gray-800 bg-gray-200 hover:bg-slate-100 w-10 h-10 items-center transition-all duration-300 ease-in-out dark:bg-gray-900 flex justify-center bottom-4 left-4 right-0 rounded-full shadow-md">
                <ThemeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar for desktop */}
        <motion.aside
          className="hidden md:flex border-r bg-card relative"
          initial={{ width: "18rem" }}
          animate={{ width: isSidebarCollapsed ? "5rem" : "18rem" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <Spinner />
            </div>
          ) : (
            <div className="h-full flex flex-col w-full overflow-hidden">
              {user && (
                <div
                  className={`${isSidebarCollapsed ? "p-3" : "p-6"} border-b`}
                >
                  <AnimatePresence initial={false}>
                    {isSidebarCollapsed ? (
                      <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-base">
                          {user.firstName?.[0] || "U"}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-4"
                      >
                        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-base">
                          {user.firstName?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground truncate max-w-[180px]">
                            {`${user.firstName || ""} ${user.lastName || ""}`}
                          </p>
                          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                            {user.email}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className={`py-6 ${isSidebarCollapsed ? "px-2" : "px-4"}`}>
                <AnimatePresence initial={false}>
                  {!isSidebarCollapsed && (
                    <motion.h3
                      key="dashboard-title"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4 px-2"
                    >
                      Dashboard
                    </motion.h3>
                  )}
                </AnimatePresence>
                <nav className="space-y-1.5">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center ${
                        isSidebarCollapsed ? "justify-center" : "gap-3"
                      } px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeIndex === index
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                      onClick={() => setActiveIndex(index)}
                      title={isSidebarCollapsed ? item.label : ""}
                    >
                      {item.icon}
                      <AnimatePresence initial={false}>
                        {!isSidebarCollapsed && (
                          <motion.span
                            key={`menu-text-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  ))}
                </nav>
                <div className="absolute p-1 dark:hover:bg-gray-800 bg-gray-200 hover:bg-slate-100 w-10 h-10 items-center transition-all duration-300 ease-in-out dark:bg-gray-900 flex justify-center bottom-4 left-4 right-0 rounded-full shadow-md">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}

          {/* Toggle button */}
          <motion.button
            className="absolute -right-3 top-20 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
            onClick={() => setSidebarCollapsed()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </motion.button>
        </motion.aside>

        {/* Main content */}
        <motion.main
          className="flex-1 overflow-auto p-6 bg-background"
          initial={{ marginLeft: 0 }}
          animate={{ marginLeft: 0 }} // Maintain fluid layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="max-w-7xl mx-auto">
            {loading ? <Spinner /> : children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;

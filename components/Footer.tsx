import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gray-800 bg-gradient-to-b from-black to-gray-900">
      {/* Decorative top edge */}
      <div className="absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-transparent to-black/80"></div>

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6">
        {/* Footer Main Content */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo className="h-8 w-auto" />
            </div>
            <p className="text-sm text-gray-400">
              Your source for innovative insights and thoughtful perspectives on
              technology, business, and personal development.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-indigo-400"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-indigo-400"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-indigo-400"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:contact@metamind.com"
                className="text-gray-400 transition-colors hover:text-indigo-400"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/posts"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search?category=Technology"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/search?category=Business"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Business
                </Link>
              </li>
              <li>
                <Link
                  href="/search?category=Science"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Science
                </Link>
              </li>
              <li>
                <Link
                  href="/search?category=Health"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Health
                </Link>
              </li>
              <li>
                <Link
                  href="/search?category=Creative"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Creative
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-indigo-400"
                >
                  Content Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © {currentYear} MetaMind. All rights reserved.
            </p>
            <p className="flex items-center text-sm text-gray-400">
              Made with <Heart className="mx-1 h-4 w-4 text-red-500" /> by the
              MetaMind Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

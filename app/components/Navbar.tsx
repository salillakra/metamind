"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenuprofile } from "../secure/home/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
    const { user } = useAuth()

    return (
        <>
            <nav className="flex relative items-center justify-between bg-base-100 px-4 py-2 shadow-md">
                <div className="flex-1">
                    <Logo className="absolute top-2 left-3" />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* <Input
                    type="text"
                    placeholder="Search"
                    className="w-24 md:w-auto"
                /> */}

                    {user ? <DropdownMenuprofile user={user} /> : (
                        <Button variant="link" className="bg-blue-500 text-white">
                            <Link href="/signin">Login</Link>
                        </Button>
                    )}

                </div>
            </nav>
            <hr className="mb-3 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

        </>

    );
}

export default Navbar;

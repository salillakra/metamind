import Link from "next/link";
import React from "react";
import { Corinthia } from "next/font/google";

const font = Corinthia({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
    display: "swap",
});

function Logo({ className }: { className?: string }) {
    return (
        <div>
            {" "}
            <Link
                className={`${font.className}  text-4xl antialiased ${className}`}
                href="/secure/home"
            >
                MetaMind
            </Link>
        </div>
    );
}

export default Logo;

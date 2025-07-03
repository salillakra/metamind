import React from 'react'
import { useRouter } from 'next/router'

const Logout = () => {
    const router = useRouter()
    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    const response = await fetch("/api/logout", { method: "POST" });
                    if (response.ok) {
                        router.push('/signin') // Redirect to signin
                    } else {
                        console.error("Failed to log out");
                    }
                } catch (error) {
                    console.error("Error during logout:", error);
                }
            }}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
            Logout
        </button>
    )
}

export default Logout
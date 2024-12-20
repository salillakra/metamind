import { useRouter } from "next/navigation";
import { useState } from "react";

function useLogout() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	async function logout() {
		try {
			setLoading(true);
			const response = await fetch("/api/logout", { method: "POST" });
			if (response.ok) {
				setLoading(false);
				router.push("/signin");
			} else {
				console.error("Failed to log out");
			}
		} catch (error) {
			setLoading(false);
		}
	}
	return { logout, loading };
}

export default useLogout;

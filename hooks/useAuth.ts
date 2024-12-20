"use client";
import { useEffect, useState } from "react";

const getUser = async () => {
	const response = await fetch("/api/user", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		throw new Error(`Failed to get user: ${response.status}`);
	}
	const user = await response.json();
	return user.payload;
};

interface IUSER {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	profilePic: string;
	bio: string;
}

export const useAuth = (): { user: IUSER | null; loading: boolean } => {
	const [user, setUser] = useState<IUSER | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUser()
			.then((user) => {
				setUser(user);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setLoading(false);
			});
	}, []);

	return { user, loading };
};

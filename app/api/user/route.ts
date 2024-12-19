import { type NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export const GET = async (req: NextRequest) => {
	try {
		const cookieStore = req.cookies;
		const token = cookieStore.get("token");

		if (!token) {
			return NextResponse.json(
				{ error: "No authentication token found" },
				{ status: 401 },
			);
		}

		if (!process.env.SECRET) {
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 },
			);
		}

		const secret = new TextEncoder().encode(process.env.SECRET);

		try {
			const user = await jose.jwtVerify(token.value, secret, {
				algorithms: ["HS256"],
			});

			if (!user) {
				return NextResponse.json({ error: "Invalid token" }, { status: 401 });
			}

			return NextResponse.json({ payload: user.payload });
		} catch (jwtError) {
			return NextResponse.json(
				{
					error: {
						message: "Invalid token",
						details: jwtError,
					},
				},
				{ status: 401 },
			);
		}
	} catch (error) {
		return NextResponse.json(
			{
				error: {
					message: "Internal server error",
					details: error,
				},
			},
			{ status: 500 },
		);
	}
};

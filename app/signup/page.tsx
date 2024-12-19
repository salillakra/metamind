"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { signup } from "@/db/signup";
import Link from "next/link";
import Logo from "../components/Logo";
import { Label } from "@/components/ui/label";
import { set } from "mongoose";
import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "@/hooks/use-toast";

const formSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		username: z.string().min(3, "Username is required"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long"),
		checkbox: z.boolean(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function SignupPage() {
	const [loading, setloading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			checkbox: false,
		},
	});
	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setloading(true);
		const message = await signup(values);
		if (message !== null && message !== undefined) {
			setloading(false);
			toast({ variant: "destructive", description: message });
		}
		router.push("/signin");
		setloading(false);
	}

	return (
		<>
			<div className="relative top-5 left-5 ">
				<Logo />
			</div>
			<div className="flex relative  justify-center items-center">
				{loading && <Spinner />}
				<div className="w-full mx-3  md:w-96 flex mt-10 md:mt-2 flex-col">
					<h1 className="md:text-3xl text-2xl mb-8">
						Sign Up To{" "}
						<span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
							Get Started🚀
						</span>
					</h1>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-4 mb-10"
						>
							<div className="flex gap-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="yourname@bitmesra.ac.in" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="********"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Your password must be at least 8 characters long.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="********"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center gap-2">
								<Checkbox required={true} id="terms" />
								<Label className="cursor-pointer" htmlFor="terms">
									Accept terms and conditions
								</Label>
							</div>

							<Button
								size={"default"}
								className="inline-block w-1/2 mx-auto"
								type="submit"
							>
								Sign Up
							</Button>
							<p className="text-center">
								Already have an account?{" "}
								<Link href="/signin" className="text-blue-500">
									Log in
								</Link>
							</p>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}

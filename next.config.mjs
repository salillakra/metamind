/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "wallpapers.com",
			},
			{
				protocol: "https",
				hostname:"easy-peasy.ai"
			}
		],
	},
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'external-content.duckduckgo.com',
				pathname: '/iu/**',  // Adjust based on the specific image URL pattern
			},
		],
	},
}

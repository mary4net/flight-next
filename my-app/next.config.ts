/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'external-content.duckduckgo.com',
      'static.vecteezy.com',
      'images.unsplash.com',
      'img.freepik.com',
      'cdn.pixabay.com'
    ],
  },
};

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

// /** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
// 	enabled: process.env.ANALYZE === 'true'
// })

// const nextConfig = {
// 	eslint: {
// 		ignoreDuringBuilds: true
// 	}
// };

// module.exports = withBundleAnalyzer(nextConfig);

/** @type {import('next').NextConfig} */

const nextConfig = {
	poweredByHeader: false,
};

module.exports = nextConfig;

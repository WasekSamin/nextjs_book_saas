module.exports = {
    reactStrictMode: false,
    images: {
        domains: ['127.0.0.1'],  // Add your local IP address or any other allowed domains here
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};
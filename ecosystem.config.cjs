module.exports = {
    apps: [
        {
            name: 'job-search-aggregator', // The name of your app
            script: 'node_modules/next/dist/bin/next', // Path to the Next.js binary
            args: 'start', // Arguments to pass (use 'dev' for development mode)
            instances: 1,
            exec_mode: 'cluster', // Use 'cluster' for load balancing
            watch: false, // Set to 'true' to enable file watching and restarting
            env: {
                NODE_ENV: 'production', // Environment variable for production
                PORT: 3311 // Port on which your Next.js app will run
            },
        }
    ]
};
module.exports = {
  apps: [
    {
      name: "frontend",
      script: "pnpm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};

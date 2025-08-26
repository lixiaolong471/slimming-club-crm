module.exports = {
  apps: [
    {
      name: 'slimming-club-crm',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        JWT_SECRET: 'aiyueli#2025'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        JWT_SECRET: 'dev-secret-key'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};

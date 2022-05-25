module.exports = {
  apps: [
    {
      name: 'ipit-app-server',
      script: './dist/main.js',
      env_development: {
        NODE_ENV: 'development',
        SERVER_PORT: 3000,
        DATABASE_HOST:
          'ipit-database-do-user-6854366-0.b.db.ondigitalocean.com',
        DATABASE_PORT: 25060,
        DATABASE_USERNAME: 'dev-admin',
        DATABASE_PASSWORD: 'jh39a30gvrphjwkk',
        DATABASE_NAME: 'dev-app',
        DATABASE_SYNCHRONIZE: true,
        DATABASE_LOGGING: false,
        JWT_SECRET: 'dj2903je92i3heu92h3euh23e9i2',
        JWT_EXPIRE: 604800000,
      },
      env_production: {
        NODE_ENV: 'production',
        SERVER_PORT: 3002,
        DATABASE_HOST:
          'ipit-database-do-user-6854366-0.b.db.ondigitalocean.com',
        DATABASE_PORT: 25060,
        DATABASE_USERNAME: 'prod-admin',
        DATABASE_PASSWORD: 'zujk6wzxquazvdpi',
        DATABASE_NAME: 'prod-app',
        DATABASE_SYNCHRONIZE: false,
        DATABASE_LOGGING: true,
        JWT_SECRET: 'dj2903je92i3heu92h3euh23e9i2',
        JWT_EXPIRE: 604800000
      },
      watch: ['dist'],
    },
  ],
};

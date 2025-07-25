export default () => ({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  redis: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  security: {
    access: {
      ttl: process.env.ACCESS_TTL,
      secret: process.env.ACCESS_SECRET,
    },
    refresh: {
      ttl: process.env.REFRESH_TTL,
      secret: process.env.REFRESH_SECRET,
    },
  },
});

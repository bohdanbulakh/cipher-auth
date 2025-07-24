import * as process from 'node:process';

export default () => ({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
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

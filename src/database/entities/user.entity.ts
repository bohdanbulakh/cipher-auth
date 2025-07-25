import {
  text,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 256 }).unique().notNull(),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }),
  password: text('password').notNull(),
});

export type UsersInsert = typeof users.$inferInsert;
export type UsersSelect = typeof users.$inferSelect;

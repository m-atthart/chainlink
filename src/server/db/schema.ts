import { relations, sql } from "drizzle-orm";
import {
  mysqlTableCreator,
  index,
  int,
  primaryKey,
  text,
  timestamp,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

export const mysqlTable = mysqlTableCreator((name) => `chainlinkk_${name}`);

export const linkks = mysqlTable(
  "linkk",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    notes: varchar("notes", { length: 512 }),
    ogTitle: varchar("ogTitle", { length: 255 }),
    ogSiteName: varchar("ogSiteName", { length: 128 }),
    ogDescription: varchar("ogDescription", { length: 512 }),
    ogImage: varchar("ogImage", { length: 255 }),
    authorId: varchar("authorId", { length: 255 }).notNull(),
    timestamp: timestamp("timestamp", {
      fsp: 3,
    })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (linkk) => ({
    authorIdIdx: index("author_id_timestamp_idx").on(
      linkk.authorId,
      linkk.timestamp, // switch to desc when feature added
    ),
  }),
);

export const linkksRelations = relations(linkks, ({ one }) => ({
  author: one(users, {
    fields: [linkks.authorId],
    references: [users.id],
  }),
}));

export const users = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
      fsp: 3,
    }).default(sql`CURRENT_TIMESTAMP(3)`),
    image: varchar("image", { length: 255 }),
  },
  (user) => ({
    userNameIdx: index("user_name_idx").on(user.name),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  linkks: many(linkks),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

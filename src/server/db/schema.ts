import {
	mysqlTable,
	index,
	int,
	varchar,
	datetime,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const link = mysqlTable(
	"Link",
	{
		id: int("id").autoincrement().primaryKey().notNull(),
		url: varchar("url", { length: 191 }).notNull(),
		notes: varchar("notes", { length: 191 }),
		ogTitle: varchar("ogTitle", { length: 191 }),
		ogSiteName: varchar("ogSiteName", { length: 191 }),
		ogDescription: varchar("ogDescription", { length: 191 }),
		ogImage: varchar("ogImage", { length: 191 }),
		username: varchar("username", { length: 191 }).notNull(),
		timestamp: datetime("timestamp", { mode: "string", fsp: 3 })
			.default(sql`(CURRENT_TIMESTAMP(3))`)
			.notNull(),
	},
	(table) => {
		return {
			usernameIdx: index("Link_username_idx").on(table.username),
		};
	}
);

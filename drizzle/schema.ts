import { sqliteTable, AnySQLiteColumn, foreignKey, primaryKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const accounts = sqliteTable("accounts", {
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text("provider_account_id").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => [
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "accounts_provider_provider_account_id_pk"})
]);

export const authenticators = sqliteTable("authenticators", {
	credentialId: text("credential_id").notNull(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	providerAccountId: text("provider_account_id").notNull(),
	credentialPublicKey: text("credential_public_key").notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text("credential_device_type").notNull(),
	credentialBackedUp: integer("credential_backed_up").notNull(),
	transports: text(),
},
(table) => [
	uniqueIndex("authenticators_credentialID_unique").on(table.credentialId),
	primaryKey({ columns: [table.credentialId, table.userId], name: "authenticators_credential_id_user_id_pk"})
]);

export const sessions = sqliteTable("sessions", {
	sessionToken: text("session_token").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	expires: integer().notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: integer().notNull(),
},
(table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verification_tokens_identifier_token_pk"})
]);

export const users = sqliteTable("users", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: integer("email_verified"),
	image: text(),
	role: text().notNull(),
	password: text(),
	createdAt: integer("created_at").default(sql`(strftime('%s', 'now'))`).notNull(),
	updatedAt: integer("updated_at").default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const drizzleMigrations = sqliteTable("__drizzle_migrations", {
});


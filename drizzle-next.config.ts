const drizzleNextConfig = {
  "version": "0.0.5",
  "packageManager": "bun",
  "latest": false,
  "dbDialect": "sqlite",
  "dbPackage": "better-sqlite3",
  "pkStrategy": "cuid2",
  "cssStrategy": "tailwind",
  "colorPalette": "teal",
  "authEnabled": true,
  "authSolution": "authjs",
  "authProviders": [
    "credentials",
    "google",
    "nodemailer"
  ],
  "adminEnabled": true,
  "install": true,
  "pluralizeEnabled": true
};

export default drizzleNextConfig;
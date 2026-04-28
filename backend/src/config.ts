import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const rootPath = path.dirname(__filename);

const config = {
  rootPath,
  publicPath: path.join(rootPath, "../public"),
  db: "mongodb://localhost/chat-bilim",
  refreshJWTSecret: process.env.REFRESH_SECRET_JWT ?? "secret",
  accessJWTSecret: process.env.ACCESS_SECRET_JWT ?? "secret",
  googleClientID: process.env.GOOGLE_CLIENT_ID ?? "google client",
  googleClientSecretID: process.env.GOOGLE_CLIENT_SECRET ?? "google secret",
};

export default config;

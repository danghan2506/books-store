import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf-8").replace(/\r/g, "");
  serviceAccount = JSON.parse(decoded);
}
else {
  const filePath = path.join(__dirname, "../utils/firebase-service-account.json");
  if (fs.existsSync(filePath)) {
    serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Connect to firebase successfully!");
} else {
  console.error("Can't find firebase credentials! Check your environment variables or firebase-service-account.json file");
}

export default admin;
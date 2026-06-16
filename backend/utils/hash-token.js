import crypto from "crypto";

// Hash token/OTP trước khi lưu DB. SHA-256 đủ an toàn ở đây vì:
// - refresh token là chuỗi ngẫu nhiên dài (JWT) -> không brute-force được
// - OTP đã có giới hạn số lần thử + TTL ngắn ở tầng AuthToken
const hashToken = (token) =>
  crypto.createHash("sha256").update(String(token)).digest("hex");

export default hashToken;

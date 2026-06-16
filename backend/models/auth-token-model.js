import mongoose from "mongoose";

// Lưu các token tạm (ephemeral) tách khỏi User doc:
// - refresh: phiên đăng nhập (mỗi thiết bị 1 doc) -> hỗ trợ multi-device
// - reset_otp: OTP đặt lại mật khẩu (hash + giới hạn số lần thử)
// Mongo tự dọn doc hết hạn qua TTL index trên `expiresAt`.
const authTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["refresh", "reset_otp"],
      required: true,
    },
    tokenHash: { type: String, required: true }, // SHA-256, không lưu giá trị thô
    attempts: { type: Number, default: 0 }, // chống brute-force cho OTP
    verified: { type: Boolean, default: false }, // OTP đã xác thực, cho phép đổi mật khẩu
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index: Mongo xoá document ngay khi qua mốc expiresAt
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuthToken = mongoose.model("AuthToken", authTokenSchema);
export default AuthToken;

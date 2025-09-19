import mongoose from "mongoose";
const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    orderItems: [
      {
        name: { type: String, required: true },
        images: [
          {
            url: { type: String, required: true },
            public_id: { type: String},
          },
        ],
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        book: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Book",
        },
      },
    ],
    shippingAddress: {
      phoneNumber: {type: String, required: true},
      district: {type: String, requierd: true},
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order", orderSchema);

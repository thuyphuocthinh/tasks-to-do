import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    email: String,
    phone: String,
    token: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

export const Users = mongoose.model("Users", usersSchema, "users");

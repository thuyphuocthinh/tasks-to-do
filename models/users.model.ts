const mongoose = require("mongoose");
const generate = require("../helpers/generate.helper");

const usersSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    email: String,
    phone: String,
    token: {
      type: String,
      default: generate.generateRandomString(30),
    },
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

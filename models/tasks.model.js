const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    status: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Tasks = mongoose.model("Tasks", tasksSchema, "tasks");
module.exports = Tasks;
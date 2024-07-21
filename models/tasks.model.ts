import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    status: String,
    timeStart: Date,
    timeFinish: Date,
    createdBy: String,
    listUsers: Array,
    taskParentId: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Tasks = mongoose.model("Tasks", tasksSchema, "tasks");
export default Tasks;

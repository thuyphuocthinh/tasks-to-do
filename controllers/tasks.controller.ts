const { pagination } = require("../helpers/pagination.helper");
const { search } = require("../helpers/search.helper");
import Tasks from "../models/tasks.model";
import { Request, Response } from "express";
interface Find {
  deleted: Boolean;
  status?: String;
  title?: String;
  $or?: any[];
}

export const index = async (req, res) => {
  try {
    let find: Find = {
      deleted: false,
      $or: [{ createdBy: req.user.id }, { listUser: req.user.id }],
    };
    let sort = {};

    // obj pagination
    let objectPagination = {
      skip: 0,
      currentPage: 0,
      limitItems: 2,
    };
    const totalItems = await Tasks.countDocuments(find);
    objectPagination = pagination(req, objectPagination, totalItems);

    // filter
    if (req.query.status) {
      find.status = req.query.status;
    }

    // sort
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }

    // search
    if (req.query.keyword) {
      const objSearch = search(req);
      find.title = objSearch.regex;
    }

    const tasks = await Tasks.find(find)
      .sort(sort)
      .skip(objectPagination.skip)
      .limit(objectPagination.limitItems);

    res.json(tasks);
  } catch (error) {
    console.log(error);
  }
};

export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const task = await Tasks.findOne({ _id: id, deleted: false });
    res.json(task);
  } catch (error) {
    res.json({
      status: 400,
      message: "Not Found",
    });
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let task = await Tasks.findOne({ _id: id, deleted: false });
    if (task) {
      await Tasks.updateOne(
        {
          _id: id,
        },
        {
          status: req.body.status,
        }
      );
    }
    task = await Tasks.findOne({ _id: id, deleted: false });
    res.json({
      status: 200,
      message: "Updated status successfully",
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 400, message: "Not Found" });
  }
};

export const changeMulti = async (req: Request, res: Response) => {
  try {
    const { key, value, ids } = req.body;
    switch (key) {
      case "status": {
        await Tasks.updateMany(
          { _id: { $in: ids } },
          {
            status: value,
          }
        );
        res.json({
          status: 200,
          message: "Updated successfully",
        });
        break;
      }

      case "delete": {
        await Tasks.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        res.json({
          status: 200,
          message: "Deleted successfully",
        });
        break;
      }

      default: {
        res.json({
          status: 400,
          message: "Not Found",
        });
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const taskParent = await Tasks.findOne({
      _id: req.body.taskParentId,
    });
    if (taskParent) {
      const task = new Tasks(req.body);
      const data = await task.save();
      res.json({
        status: 200,
        message: "Created a new task successfully",
        data: data,
      });
    } else {
      res.json({
        status: 200,
        message: "Task Parent does not exist",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Tasks.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );
    res.json({
      status: 200,
      message: "Updated task successfully",
      data: task,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Tasks.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    res.json({
      status: 200,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

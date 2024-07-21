import Tasks from "../models/tasks.model";
import { Users } from "../models/users.model";
import { Request, Response } from "express";
import { pagination } from "../helpers/pagination.helper";
import { search } from "../helpers/search.helper";

interface Find {
  deleted: Boolean;
  status?: string;
  title?: RegExp;
  $or?: any[];
}

export const index = async (req: Request, res: Response) => {
  try {
    let find: Find = {
      deleted: false,
      // $or: [{ createdBy: req.user.id }, { listUser: req.user.id }],
    };
    let sort = {};

    // obj pagination
    let objectPagination: {
      limitItems: number;
      currentPage: number;
      skip?: number;
      totalPage?: number;
    } = {
      skip: 0,
      currentPage: 0,
      limitItems: 2,
      totalPage: 0,
    };
    const totalItems: number = await Tasks.countDocuments(find);
    objectPagination = pagination(req, objectPagination, totalItems);

    // filter
    if (req.query.status) {
      find.status = req.query.status.toString();
    }

    // sort
    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toString();
      sort[sortKey] = req.query.sortValue;
    }

    // search
    if (req.query.keyword) {
      const objSearch: {
        keyword: string;
        regex?: RegExp;
      } = search(req);
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
    const key: string = req.body;
    const value: string = req.body;
    const ids: string[] = req.body;
    enum Key {
      STATUS = "status",
      DELETE = "delete",
    }
    switch (key) {
      case Key.STATUS: {
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

      case Key.DELETE: {
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

export const create = async (req: Request, res: Response) => {
  try {
    const token: string = req.cookies.token;
    const user = await Users.findOne({ token: token });
    req.body.createdBy = user.id;
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

const { pagination } = require("../helpers/pagination.helper");
const { search } = require("../helpers/search.helper");
const Tasks = require("../models/tasks.model");

const index = async (req, res) => {
  try {
    let find = { deleted: false };
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
      find = { ...find, status: req.query.status };
    }

    // sort
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }

    // search
    if (req.query.keyword) {
      const objSearch = search(req);
      find = {
        ...find,
        title: objSearch.regex,
      };
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

const detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Tasks.findOne({ _id: id, deleted: false });
    res.json(task);
  } catch (error) {
    res.json({
      status: 400,
      message: "Not Found",
    });
  }
};

const changeStatus = async (req, res) => {
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

const changeMulti = async (req, res) => {
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

const create = async (req, res) => {
  try {
    const task = new Tasks(req.body);
    const data = await task.save();
    res.json({
      status: 200,
      message: "Created a new task successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
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

const deleteItem = async (req, res) => {
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

module.exports = {
  index,
  detail,
  changeStatus,
  changeMulti,
  create,
  edit,
  deleteItem,
};
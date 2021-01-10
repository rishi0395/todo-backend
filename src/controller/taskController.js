const Task = require('../model/taskModel');

exports.taskSubmit = (req, res) => {
  Task.findOne({ task: req.body.task }).exec(async (err, taskFound) => {
    const dbTask = req.body;

    if (taskFound) {
      return res.status(400).json({
        message: 'Task already present and duplicate not allowed',
        transactionSuccess: false
      });
    }

    const { projectId, task, date } = dbTask;

    const _task = new Task({
      archived: false,
      projectId,
      task,
      date
    });

    _task.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: 'Something went wrong',
          transactionSuccess: false,
          error
        });
      }

      if (data) {
        return res.status(201).json({
          message: 'Task submitted Successfully..!',
          transactionSuccess: true,
          data
        });
      }
    });
  });
};

exports.tasksSync = (req, res) => {
  Task.find({}).exec((err, docs) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(docs);
    }
  });
};

exports.taskModify = async (req, res) => {
  _id = req.params.id;
  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res
        .status(404)
        .send({ transactionSuccess: false, error: 'invalid operation' });
    }

    res.status(200).send({ transactionSuccess: true, task });
  } catch (error) {
    res.status(500).send({ transactionSuccess: false, error });
  }
};

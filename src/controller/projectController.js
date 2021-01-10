const Project = require('../model/projectModel');
const Task = require('../model/taskModel');

exports.projectSubmit = (req, res) => {
  Project.findOne({ name: req.body.name }).exec(async (err, project) => {
    const dbProject = req.body;
    if (project) {
      return res.status(400).json({
        message: 'Project already present and duplicate not allowed',
        transactionSuccess: false
      });
    }

    const { name, projectId } = dbProject;

    const _project = new Project({
      name,
      projectId,
      userId: '1234'
    });

    _project.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: 'Something went wrong',
          transactionSuccess: false,
          error
        });
      }

      if (data) {
        return res.status(201).json({
          message: 'project submitted Successfully..!',
          transactionSuccess: true,
          data
        });
      }
    });
  });
};

exports.projectsSync = (req, res) => {
  Project.find({})
    .sort({ date: 'descending' })
    .exec((err, docs) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(docs);
      }
    });
};

exports.projectDelete = async (req, res) => {
  _id = req.params.id;
  try {
    const project = await Project.findOneAndDelete({
      _id
    });
    const deletedTask = await Task.deleteMany({ projectId: project.projectId });
    if (!project && !deletedTask) {
      return res
        .status(404)
        .send({ transactionSuccess: false, error: 'invalid operation' });
    }

    res.status(200).send({ transactionSuccess: true, project });
  } catch (error) {
    res.status(500).send({ transactionSuccess: false, error });
  }
};

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  archived: {
    type: Boolean
  },
  projectId: {
    type: String
  },
  task: {
    type: String
  },
  date: {
    type: String
  }
});

module.exports = mongoose.model('taskcontents', taskSchema);

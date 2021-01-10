const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    projectId: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('projects', projectSchema);

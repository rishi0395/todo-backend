const express = require('express');

const {
  tasksSync,
  taskSubmit,
  taskModify
} = require('../controller/taskController');

const router = express.Router();

router.get('/tasksSync', tasksSync);
router.post('/taskSubmit', taskSubmit);
router.patch('/taskModify/:id', taskModify);

module.exports = router;

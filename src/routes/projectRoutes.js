const express = require('express');

const {
  projectsSync,
  projectSubmit,
  projectDelete
} = require('../controller/projectController');

const router = express.Router();

router.get('/projectsSync', projectsSync);
router.post('/projectSubmit', projectSubmit);
router.delete('/projectsDelete/:id', projectDelete);

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'working'
  });
});

module.exports = router;

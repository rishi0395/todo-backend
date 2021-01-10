const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv');
const mongoose = require('mongoose');
var Pusher = require('pusher');

const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const pusher = new Pusher({
  appId: '1135618',
  key: 'e239bd76b8f00ec6ca9b',
  secret: '7028db3ec509962bbd3f',
  cluster: 'ap2',
  useTLS: true
});

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// to access env files
env.config();
const {
  PORT,
  MONGO_DB_DATABASE,
  MONGO_DB_PASSWORD,
  MONGO_DB_USER,
  MONGO_DB_UNIQUE_IDENTIFIER
} = process.env;

dbConnectionPath = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0.${MONGO_DB_UNIQUE_IDENTIFIER}.mongodb.net/${MONGO_DB_DATABASE}?retryWrites=true&w=majority`;

mongoose
  .connect(dbConnectionPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err.message);
  });

const db = mongoose.connection;

db.once('open', () => {
  console.log('db is Connected');

  const projectCollection = db.collection('projects');
  const changeProjectStream = projectCollection.watch();

  changeProjectStream.on('change', (change) => {
    console.log(change);
    if (change.operationType === 'insert') {
      const projectDetails = change.fullDocument;
      const { name, projectId, _id } = projectDetails;

      pusher.trigger('project', 'inserted', {
        name,
        projectId,
        _id
      });
    } else {
      console.log('Error triggering Pusher');
    }
  });

  const taskCollection = db.collection('taskcontents');
  const changeTaskStream = taskCollection.watch();

  changeTaskStream.on('change', (change) => {
    console.log(change);
    if (change.operationType === 'insert') {
      const taskDetails = change.fullDocument;
      const { task, date, projectId, _id, archived } = taskDetails;

      pusher.trigger('task', 'inserted', {
        task,
        date,
        projectId,
        _id,
        archived
      });
    } else {
      console.log('Error triggering Pusher');
    }
  });
});

app.use('/api', projectRoutes);
app.use('/api', taskRoutes);

app.listen(PORT, () => console.log('server is listening', PORT));

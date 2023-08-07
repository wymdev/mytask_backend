const express = require('express');
const bodyParser = require('body-parser');
// create express app
const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send("API is connected");
});

const taskRoutes = require('./src/routes/tasklist.routes')

app.use('/api/v1/tasks', taskRoutes)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
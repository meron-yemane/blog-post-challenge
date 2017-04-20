const express = require('express');
const morgan = require('morgan');
const mogoose = require('mongoose');
const bodyParser = require('body-parser');
//mongoose.Promise = global.Promise;

const app = express();

const blogRouter = require('./blogRouter')

const {PORT, DATABASE_URL} = require('./config')
const {Blogs} = require('./models')

app.use(bodyParser.json());

app.use(morgan('common'));

app.use('/blog', blogRouter);

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
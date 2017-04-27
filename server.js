const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const app = express();
const blogRouter = require('./blogRouter')

const {PORT, DATABASE_URL} = require('./config')
const Blogs = require('./models')

app.use(bodyParser.json());

app.use(morgan('common'));

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      }).on('error', err => {
        mongoose.disconnect();
        reject(err)
      });
    });
  });
}
 
function closeServer() {
  return mongoose.disconnect().then(() => {
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
  });
}
app.get('/posts', (req, res) => {
  Blogs
    .find()
    .exec()
    .then(posts => {
      res.json(posts.map((post) => post.apiRepr()));
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

app.get('/posts/:id', (req, res) => {
  Blogs
    .findById(req.params.id)
    .exec()
    .then(restaurant => res.json(restaurant.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.post('/posts', (req, res) => {
  const requiredFields = ['firstName', 'lastName', 'content', 'title'];
  for (var i=0; i<requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Blogs
    .create({
      author: {
        firstName: req.body.firstName,
        lastName: req.body.lastName
      },
      content: req.body.content,
      title: req.body.title,
      publishDate: req.body.publishDate})
    .then(
      post => res.status(201).json(post.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

  app.put('/posts/:id', (req, res) => {
    if (!(req.params.id === req.body.id)) {
      const message = ('Request path id must match request body id');
      console.error(message);
      res.status(400).json({message: 'Request path id must match request body id'});
    };

    const toUpdate = {};
    const updateableFields = ['author', 'title', 'publishDate', 'content'];
    updateableFields.forEach(field => {
        if (field === 'author') {
          toUpdate['author'] = {};
          toUpdate.author.firstName = req.body.firstName;
          toUpdate.author.lastName = req.body.lastName;
        } else {
          toUpdate[field] = req.body[field];
        }
    });
    console.log(toUpdate);
    Blogs 
      .findByIdAndUpdate(req.params.id, {$set: toUpdate})
      .exec()
      .then(post => res.status(200).json(post))
      .catch(err => res.status(500).json({message: 'Internal server error'}));
  }); 

  app.delete('/posts/:id', (req, res) => {
    Blogs 
      .findByIdAndRemove(req.params.id)
      .exec()
      .then(blog => res.status(204).end())
      .catch(err => res.status(500).json({message: 'Internal server error'}));
  });

  app.use('*', function(req, res) {
    res.status(404).json({message: 'Not found'});
  });

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
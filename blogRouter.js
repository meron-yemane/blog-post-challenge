const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const router = express.Router();

const {BlogPosts} = require('./models');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Blog post ${req.params.id} has been deleted`);
  res.status(204).end()
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const blog_piece = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(blog_piece);

});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.body.id !== req.params.id) {
    const message = `The request body id and the request path id must match`;
    console.error(message);
    res.status(400).send(message);
  }
  console.log('Updating the blog');
  const updatedBlogPiece = BlogPosts.update({
      'title': req.body.title,
      'content': req.body.content,
      'author': req.body.author,
      'id': req.params.id
    });
  res.status(204).json(updatedBlogPiece);
});

module.exports = router;
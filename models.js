const mongoose = require('mongoose');

const uuid = require('uuid');

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  publishDate: {type: Date, required: false},
  author: {
    firstName: String,
    lastName: String
  }
});

blogSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()
});

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}


const Blogs = mongoose.model('Blogs', blogSchema);


module.exports = {BlogPosts: createBlogPostsModel()};
module.exports = {Blogs}
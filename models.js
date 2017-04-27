const mongoose = require('mongoose');

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

blogSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    title: this.title,
    content: this.content,
    publishDate: this.publishDate
  };
}


const Blogs = mongoose.model('Blogs', blogSchema);

module.exports = Blogs
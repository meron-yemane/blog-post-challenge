exports.DATABASE_URL = process.env.MONGODB_URI ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/blogs-app';
exports.PORT = process.env.PORT || 8080;
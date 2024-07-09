const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const dbName = 'bloglist';  // Replace with your database name
const url = `mongodb+srv://bloglist:OmaServeri420.@cluster0.bxg8fsc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;  // Replace with your MongoDB connection string

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Define the schema and model
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

// Example of creating a new blog
const blog = new Blog({
  title: 'Example Blog',
  author: 'Author Name',
  url: 'http://example.com',
  likes: 0
});

blog.save().then(result => {
  console.log('Blog saved:', result);
  mongoose.connection.close();
}).catch(error => {
  console.error('Error saving blog:', error.message);
});


/*const mongoose = require('mongoose');

// Define the schema for blogs
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

// Create the Blog model from the schema
const Blog = mongoose.model('Blog', blogSchema);

// Connect to the MongoDB database
const mongoUrl = 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Export the Blog model to use it in other files
module.exports = Blog;*/
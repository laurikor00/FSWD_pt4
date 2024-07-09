const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();

// Connect to MongoDB
const mongoUrl = 'mongodb+srv://bloglist:kS3t3XubEMtE5Ib2@cluster0.bxg8fsc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' 
//config.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

// Define the blog schema and model
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});
const Blog = mongoose.model('Blog', blogSchema);

app.use(cors());
app.use(express.json());

// Define the routes
app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save()
    .then(result => {
      response.status(201).json(result);
    });
});

// Export the app instance
module.exports = app;

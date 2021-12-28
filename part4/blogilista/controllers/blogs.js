const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.title || !blog.url) {
    return response.status(401).send();
  }
  if (!blog.likes) {
    blog.likes = 0;
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const blog = await Blog.findById(id);
  blog.likes = body.likes ?? 0;

  blog.save();
  response.status(200).json(blog);
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).send();
})

module.exports = blogsRouter;

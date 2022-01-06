const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');

  response.json(blogs.map(blog => blog.toJSON()));
})

blogsRouter.post('/', async (request, response, next) => {

  const body = request.body;

  const user = request.user;
  if (!user) {
    return response.status(401).send({error: "User not found"});
  }

  const blog = new Blog(body);
  blog.user = user._id;
  blog.likes = blog.likes ?? 0;

  if (!blog.title || !blog.url) {
    return response.status(400).json({error: "title or url missing"});
  }

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  user.save();
  response.status(201).json(savedBlog);
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const user = request.user;
  if (!user) {
    return response.status(401).send({error: "User not found"});
  }


  const blog = await Blog.findById(id);
  blog.likes = body.likes ?? 0;

  blog.save();
  response.status(200).json(blog);
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).send({error: "Blog not found"});
  }

  const user = request.user;
  if (!user) {
    return response.status(401).send({error: "User not found"});
  }
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).send({error: "User id does not match blog's user"});
  } 

  await Blog.findByIdAndRemove(blog._id);
  response.status(204).send();
})

module.exports = blogsRouter;

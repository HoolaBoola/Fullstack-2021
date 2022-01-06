const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const initialUser = {
  username: "initialuser",
  name: "initialuser",
  password: "initialuser"
}
let creds = {
  username: initialUser.username,
  password: initialUser.password
};
const initialBlogs = [
  {
    "title": "test",
    "author": "test",
    "url": "test",
    "likes": 666
  },
  {
    "title": "Why I hate fullstack web development",
    "author": "FS hater",
    "url": "google.com",
    "likes": -1000
  }
]
let token = null;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  let res = await api.post('/api/users')
    .send(initialUser);

  let userid = res.body.id;

  let blogObject = new Blog(initialBlogs[0]);
  blogObject.user = userid;

  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  blogObject.user = userid;
  await blogObject.save();

  res = await api.post('/api/login')
    .send(creds);
  token = res.body.token;

});

test('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('correct amount of blogs returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(initialBlogs.length);
});

test('identifying field is id', async () => {
  const response = await api.get('/api/blogs')

  const first = response.body[0];
  expect(first.id).toBeDefined();
});
  
test('adding without authorization returns 401', async () => {
  const newObject = {
    "title": "this blog will not be added",
    "author": "adder",
    "url": "add.er",
    "likes": 42
  };

  await api.post('/api/blogs')
    .send(newObject)
    .expect(401);
});

test('can add new blog', async () => {
  const newObject = {
    "title": "this blog was added",
    "author": "adder",
    "url": "add.er",
    "likes": 42
  };

  await api.post('/api/blogs')
    .set({"authorization": `bearer ${token}`})
    .send(newObject)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(response.body[initialBlogs.length].title).toContain(newObject.title);
});

test('likes is 0 if not set', async () => {
  const newObject = {
    "title": "this blog was added",
    "author": "adder",
    "url": "add.er"
  };

  await api.post('/api/blogs')
    .set({"authorization": `bearer ${token}`})
    .send(newObject)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const blog = response.body[initialBlogs.length];
  expect(blog.likes).toBe(0);
});

test('sending blog without title or url returns bad request', async () => {
  const newObject = {
    "author": "blogger who doesn't know how to title stuff",
    "likes": 10000
  };

  await api.post('/api/blogs')
    .set({"authorization": `bearer ${token}`})
    .send(newObject)
    .expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});

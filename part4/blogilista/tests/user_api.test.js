const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');
const initialUsers = [
  {
    "username": "test",
    "name": "test",
    "password": "test"
  },
  {
    "username": "abcdefg",
    "name": "Martin",
    "password": "qwerty123"
  }
]

beforeEach(async () => {
  await User.deleteMany({});

  let userObject = new User(initialUsers[0]);
  await userObject.save();

  userObject = new User(initialUsers[1]);
  await userObject.save();
});

test('users are returned as json', async () => {
  await api.get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('correct amount of users returned', async () => {
  const response = await api.get('/api/users');

  expect(response.body).toHaveLength(initialUsers.length);
});

test('identifying field is id', async () => {
  const response = await api.get('/api/users')

  const first = response.body[0];
  expect(first.id).toBeDefined();
});
  
test('can add new user', async () => {
  const newObject = {
    "username": "new user",
    "name": "new name who dis",
    "password": "new secret password"
  };

  await api.post('/api/users')
    .send(newObject)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/users');
  expect(response.body).toHaveLength(initialUsers.length + 1);
  expect(response.body[initialUsers.length].name).toContain(newObject.name);
});

test('sending user without username returns bad request', async () => {
  const newObject = {
    "name": "man with no username",
    "password": "asdbdsa"
  };

  await api.post('/api/users')
    .send(newObject)
    .expect(400);
});

test('sending user without password returns bad request', async () => {
  const newObject = {
    "username": "passwordsSuck",
    "name": "Matt",
  };

  await api.post('/api/users')
    .send(newObject)
    .expect(400);
});

test('sending user with too short username returns bad request', async () => {
  const newObject = {
    "username": "a",
    "name": "man with no username",
    "password": "asdbdsa"
  };

  await api.post('/api/users')
    .send(newObject)
    .expect(400);
});

test('sending user without password returns bad request', async () => {
  const newObject = {
    "password": "a",
    "username": "passwordsSuck",
    "name": "Matt",
  };

  await api.post('/api/users')
    .send(newObject)
    .expect(400);
});


afterAll(() => {
  mongoose.connection.close();
});

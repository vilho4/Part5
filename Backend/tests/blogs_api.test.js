const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper=require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('teppo testaaja is one of the authors', async () => {
  const response = await api.get('/api/blogs')

  const authors = response.body.map(e => e.author)
  assert.strictEqual(authors.includes('Teppo Testaaja'), true)
})

test('the blog has id instead of _id', async () => {
  const response = await api.get('/api/blogs')
  assert(response.body.length > 0, 'no blogs found' )
  const blogit = response.body
  blogit.forEach((blogi) => {
    assert('id' in blogi, " 'id' property exists")
  })
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title:'Uuden blogin lisäys',
    author:'Uusi blogaaja',
    url:'www.newblog.com',
    likes:103
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const author = response.body.map(r => r.author)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  assert(author.includes('Uusi blogaaja'))
})

test('Blog without likes gets 0 likes', async () => {
  const noLikesBlog = {
    title:'Likettömän blogin lisäys',
    author:'Liketön blogaaja',
    url:'www.likelessblog.com'
  }
  await api
    .post('/api/blogs')
    .send(noLikesBlog)
    .expect(201)

  const response = await api.get('/api/blogs')
  const vikanLiket = response.body[response.body.length-1].likes

  assert.strictEqual(vikanLiket, 0, 'If no likes assigned then 0')
})

test('Blog without title or URL should return 400', async () => {
  try {
    const noTitle = {
      author: 'Liketön blogaaja',
      url: 'www.likelessblog.com'
    }

    await api
      .post('/api/blogs')
      .send(noTitle)
      .expect(400)

    const noUrl = {
      title: 'No URL Blog',
      author: 'Urli puuttuu'
    }

    await api
      .post('/api/blogs')
      .send(noUrl)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  } catch (error) {
    throw new Error('Test failed: ' + error.message)
  }
})

test('Blog will be added and then deleted', async () => {
  try {
    const dummyBlog = {
      title:'Will be deleted',
      author: 'Will Delete',
      url: 'www.deleted.com',
      likes:2,
    }
    const deleteThis = await api
      .post('/api/blogs')
      .send(dummyBlog)
      .expect(201)

    await api
      .delete(`/api/blogs/${deleteThis.body.id}`)
      .expect(204)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  } catch (error) {
    throw new Error('Test failed: ' + error.message)
  }
})

test('Testauspäiväkirjat osa 2 will be updated to osa 3', async () => {
  try {
    const dummyBlog = {
      title:'Teppo Testaajan testauspäiväkirjat osa 3',
      author: 'Teppo Testaaja',
      url: 'wwww.example.com',
      likes:110,
    }

    const response = await api
      .get('/api/blogs')
      .expect(200)

    const toUpdate=response.body.find(blog => blog.title === 'Teppo Testaajan testauspäiväkirjat osa 2')

    await api
      .put(`/api/blogs/${toUpdate.id}`)
      .send(dummyBlog)
      .expect(200)

    const updatedResponse = await api
      .get(`/api/blogs/${toUpdate.id}`)
      .expect(200)

    const updatedBlog = updatedResponse.body

    assert.strictEqual(updatedBlog.title, dummyBlog.title, 'previous blog matches to updated')
  } catch (error) {
    throw new Error('Test failed: ' + error.message)
  }
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

test('blog will be not added if the user is missing their token', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const dummyBlog = {
    title: 'Will be deleted',
    author: 'Will Delete',
    url: 'www.deleted.com',
    likes: 2,
    user:''
  }

  const result = await api
    .post('/api/blogs')
    .send(dummyBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
}

)

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
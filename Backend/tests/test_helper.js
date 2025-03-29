const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Teppo Testaajan testauspäiväkirjat',
    author: 'Teppo Testaaja',
    url: 'www.example.com',
    likes: 101
  },
  {
    title: 'Teppo Testaajan testauspäiväkirjat osa 2',
    author: 'Teppo Testaaja',
    url: 'www.example.com',
    likes: '102'
  }
]


const nonExistingId = async () => {
  const blog = new Blog(
    {
      title: 'willremovethissoon',
      author: 'will get removed',
      likes:104
    }
  )
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports= {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}
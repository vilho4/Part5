const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }  return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username:1, name:1, id:1 })
  response.status(200).json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.status(200).json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const { title, author, url, likes } = request.body
  const blogLikes = (typeof likes === 'number' && likes >= 0) ? likes : 0

  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  // const user = await User.findById(decodedToken.id)
  // const user = await User.findById(request.body.userId)

  const blog = new Blog ({
    title,
    author,
    url,
    likes:blogLikes,
    user: user._id
  })
  // console.log(blog)
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
    logger.info(`${savedBlog.title} saved successfully`)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    logger.info(`User ${user._id} blogs updated successfully`)
  } catch (error) {
    response.status(400).json({ error: `Bad request: ${error.message}` })
    logger.error(`Error during blog save or user update: ${error.message}`)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true }
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    logger.info(`${updatedBlog.title} updated succesfully`)
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    if (deletedBlog.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'only creator is able to delete' })
    }

    logger.info('Blog deleted successfully')
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter

// const blog = require("../models/blog")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likes = blogs.map(blog => blog.likes)
  const total = likes.reduce((sum, like) => sum + like, 0)
  return total
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const mostLikedBlog = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
  return {
    title:mostLikedBlog.title,
    author:mostLikedBlog.author,
    likes:mostLikedBlog.likes
  }
}

const mostActiveAuthor = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  let mostActive = Object.entries(authorCount).reduce((max, entry) => {
    return entry[1] > max[1] ? entry : max
  })
  return mostActive
}

const mostLikedAuthor = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = {}

  blogs.forEach(blog => {
    if (likesByAuthor[blog.author]) {
      likesByAuthor[blog.author] += blog.likes
    } else {
      likesByAuthor[blog.author] = blog.likes
    }
  })

  let likedAuthor = { author: '', totalLikes: 0 }

  for (const author in likesByAuthor) {
    if (likesByAuthor[author] > likedAuthor.totalLikes) {
      likedAuthor = {
        author: author,
        totalLikes: likesByAuthor[author]
      }
    }
  }

  return likedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostActiveAuthor,
  mostLikedAuthor
}
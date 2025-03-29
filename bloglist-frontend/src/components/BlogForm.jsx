import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ onBlogCreated }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create(newBlog)
      setNewBlog({ title: '', author: '', url: '' })
      onBlogCreated(createdBlog)
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a new blog</h3>
      <div>
        Title: <input type="text" name="title" value={newBlog.title} onChange={handleChange} />
      </div>
      <div>
        Author: <input type="text" name="author" value={newBlog.author} onChange={handleChange} />
      </div>
      <div>
        Url: <input type="text" name="url" value={newBlog.url} onChange={handleChange} />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm
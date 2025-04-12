import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

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
        <form className="blogform" onSubmit={handleSubmit}>
        <h3>Add a new blog</h3>
    
        <div className="input-group-title" style={{ marginBottom: '10px' }}>
          <label htmlFor="title">Title:</label>
          <input 
            id="title" 
            type="text" 
            name="title" 
            value={newBlog.title} 
            onChange={handleChange} 
            style={{ width: '10%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
    
        <div className="input-group-author" style={{ marginBottom: '10px' }}>
          <label htmlFor="author">Author:</label>
          <input 
            id="author" 
            type="text" 
            name="author" 
            value={newBlog.author} 
            onChange={handleChange} 
            style={{ width: '10%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
    
        <div className="input-group-url" style={{ marginBottom: '10px' }}>
          <label htmlFor="url">Url:</label>
          <input 
            id="url" 
            type="text" 
            name="url" 
            value={newBlog.url} 
            onChange={handleChange} 
            style={{ width: '10%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
    
        <button 
          id="submit" 
          type="submit" 
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Create
        </button>
      </form>
    )
    }

BlogForm.propTypes = {
    onBlogCreated: PropTypes.func.isRequired
}

export default BlogForm
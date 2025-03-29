import { useState } from 'react'
import OneBlog from './OneBlog';

const Blog = ({ blog, onLike, onDelete, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(prev => !prev)
  }

  return (
  <div>
    {blog.title} {blog.author}
    <button onClick={toggleDetails}>
        {detailsVisible ? 'Hide Details' : 'View Details'}
      </button>
      {detailsVisible && (
        <OneBlog blog={blog} onLike={onLike} onDelete={onDelete} user={user}/>
      )}
  </div>  
  )
}

// view painike jolla katsotaan yksittäisen blogin tiedot, 

export default Blog
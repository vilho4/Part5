import { useState } from 'react'
import OneBlog from './OneBlog'

const Blog = ({ blog, onLike, onDelete, user }) => {
    const [detailsVisible, setDetailsVisible] = useState(false)

    const toggleDetails = () => {
        setDetailsVisible(prev => !prev)

    }

    return (
        <div className='blog'>
            {blog.title} {blog.author}
            <button onClick={toggleDetails}>
                {detailsVisible ? 'Hide' : 'View'}
            </button>
            {detailsVisible && (
                <OneBlog blog={blog} onLike={onLike} onDelete={onDelete} user={user}/>
            )}
        </div>
    )
}

export default Blog
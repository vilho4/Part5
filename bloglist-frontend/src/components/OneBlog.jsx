const OneBlog = ( { blog, onLike, onDelete, user } ) => {
    return (
        <div className="oneblog">
            <div>{blog.url}</div>
            <div >likes: {blog.likes} <button className="like-button"
                aria-label="like this blog"
                onClick={() => onLike(blog.id)}></button> </div>
            <div>{blog.user?.name}</div>
            {blog.user?.username === user.username &&(
                <button className="delete-button" onClick={() => onDelete(blog.id)}>Delete</button>
            )}
        </div>
    )
}

export default OneBlog
const OneBlog = ( {blog, onLike, onDelete, user} ) => {
    console.log(user.username,'testi')
    // console.log(blog, 'testi')
    return (
        <div className="oneblog">
            <div>{blog.url}</div>
            <div >likes: {blog.likes} <button className="like-button" onClick={() => onLike(blog.id)}></button> </div>
            <div>{blog.user?.name}</div>
            {blog.user?.username === user.username &&(
            <button className="delete-button" onClick={() => onDelete(blog.id)}>Delete</button>
            )}
        </div>
    )
}

export default OneBlog
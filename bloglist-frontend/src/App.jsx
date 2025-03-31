import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationMessage from './components/NotificationMessage'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import './index.css'

const App = () => {
    const [blogs, setBlogs] = useState([])
    // const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState({ message: '', type: '' })
    const [blogFormVisible, setBlogFormVisible] = useState(false)

    useEffect(() => {
        const fetchBlogs = async () => {
            const blogs = await blogService.getAll()
            const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
            setBlogs(sortedBlogs)
        }
        fetchBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }  }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            setNotification({ message: `${user.username} logged in succesfully`, type: 'success' })
            setTimeout(() => setNotification({ message: '', type: '' }), 5000)
        } catch (error) {
            setNotification({ message: 'Wrong username or password!', type: 'error' })
            setTimeout(() => setNotification({ message: '', type: '' }), 5000)
            setUsername('')
            setPassword('')
        }
    }
    // const loginForm = () => (
    //   <form onSubmit={handleLogin}>
    //     <div>
    //       <h2>Login</h2>
    //       username
    //         <input
    //         type="text"
    //         value={username}
    //         name="Username"
    //         onChange={({ target }) => setUsername(target.value)}
    //       />
    //     </div>
    //     <div>
    //       password
    //         <input
    //         type="password"
    //         value={password}
    //         name="Password"
    //         onChange={({ target }) => setPassword(target.value)}
    //       />
    //     </div>
    //     <button type="submit">login</button>
    //   </form>
    // )


    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        setNotification({ message: 'Logged out successfully', type: 'success' })
        setTimeout(() => setNotification({ message: '', type: '' }), 5000)
    }

    const handleBlogCreated = (newBlog) => {
        const blogWithUser = { ...newBlog, user }

        setBlogs(prevBlogs =>
            [...prevBlogs, blogWithUser].sort((a, b) => b.likes - a.likes)
        )

        setNotification({ message: `Added ${newBlog.title} by ${newBlog.author}`, type: 'success' })
        setTimeout(() => setNotification({ message: '', type: '' }), 5000)
        setBlogFormVisible(false)
    }

    const toggleCreateBlogVisibility = () => {
        setBlogFormVisible(!blogFormVisible)
    }

    if (user===null){
        return (
            <div>
                {!user}
                {/* {!user && loginForm()} */}
                <NotificationMessage notification={notification} />
                <LoginForm
                    username = {username}
                    password={password}
                    handleLogin={handleLogin}
                    handleUsernameChange={handleUsernameChange}
                    handlePasswordChange={handlePasswordChange}
                />
            </div>
        )
    }

    const handleLike = async (id) => {

        try {

            const blogToUpdate = blogs.find(blog => blog.id === id)
            const updatedBlog = { ...blogToUpdate, likes:blogToUpdate.likes + 1 }

            await blogService.update(id, updatedBlog)


            setBlogs(prevBlogs =>
                [...prevBlogs.map(blog =>
                    blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
                )]  .sort((a, b) => b.likes - a.likes)
            )
            setNotification({ message: `likes updated for ${updatedBlog.title}`, type: 'success' })
            setTimeout(() => setNotification({ message: '', type: '' }), 50)  }
        catch(error){
            setNotification({ message: `likes were not updated for ${id}`, type: 'error' })
            setTimeout(() => setNotification({ message: '', type: '' }), 5000)
        }
    }

    const handleDelete = async (id) => {
        try {
            const blogToDelete = blogs.find(blog => blog.id === id)
            if (!blogToDelete) {
                setNotification({ message: 'Blog not found', type: 'error' })
                setTimeout(() => setNotification({ message: '', type: '' }), 5000)
                return
            }

            if (window.confirm(`${blogToDelete.title} - Are you sure you want to delete?`)) {
                await blogService.remove(id)

                setBlogs(prevBlogs =>
                    prevBlogs.filter(blog => blog.id !== id).sort((a, b) => b.likes - a.likes)
                )

                setNotification({ message: 'Blog deleted successfully', type: 'success' })
                setTimeout(() => setNotification({ message: '', type: '' }), 5000)
            }
        } catch (error) {
            setNotification({ message: `Error deleting blog: ${error.message}`, type: 'error' })
            setTimeout(() => setNotification({ message: '', type: '' }), 5000)
        }
    }

    return (
        <div>
            <NotificationMessage notification={notification} />
            <h2>Blogs</h2>
            <p>{user.username} logged in <button onClick={handleLogout}>Logout</button> </p>
            {blogFormVisible && <BlogForm onBlogCreated={handleBlogCreated} />}
            <button onClick={toggleCreateBlogVisibility}>
                {blogFormVisible ? 'Cancel' : 'New Blog'}
            </button>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} onLike={handleLike} onDelete={handleDelete} user={user}/>
            )}
        </div>
    )
}

export default App
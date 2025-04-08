import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'// Import from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import OneBlog from './OneBlog'

test('renders blog title and blog author', () => {
    const testiblog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'www.example.com',
        likes: 5,
        user: {
            username: 'John',
            name: 'John Doe',
        },
    }

    render(<Blog blog={testiblog} />)

    const titleAuthorElement = screen.getByText('Test Blog Title Test Author')
    expect(titleAuthorElement).toBeDefined()

})

test('url not displayed', () => {
    const testiblog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'www.example.com',
        likes: 5,
        user: {
            username: 'John',
            name: 'John Doe',
        },
    }

    render(<Blog blog={testiblog} />)

    const url = screen.queryByText('www.example.com')
    expect(url).toBeNull()
})

test('likes are not displayed', () => {
    const testiblog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'www.example.com',
        likes: 5,
        user: {
            username: 'John',
            name: 'John Doe',
        },
    }

    render(<Blog blog={testiblog} />)

    const likes = screen.queryByText('5')
    expect(likes).toBeNull()
})

// test ('view button displays url and likes', async () => {
//     const testiblog = {
//         title: 'Test Blog Title',
//         author: 'Test Author',
//         url: 'www.example.com',
//         likes: 5,
//         user: {
//             username: 'John',
//             name: 'John Doe',
//         },
//     }

//     const mockHandler = vi.fn()

//     render (
//         <Blog blog={blog} toggleDetails={detailsVisible} />
//     )

//     const user = userEvent.setup()
//     const button = screen.getByText('View')
//     await user.click(button)

// })

test ('like is pressed twice', async () => {
    const testiblog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'www.example.com',
        likes: 5,
        user: {
            username: 'John',
            name: 'John Doe',
        },
    }

    const currentUser = {
        username: 'John',
        name: 'John Doe',
    }

    const mockLikeHandler = vi.fn()
    const mockDeleteHandler = vi.fn()

    render(
        <OneBlog
            blog={testiblog}
            onLike={mockLikeHandler}
            onDelete={mockDeleteHandler}
            user={currentUser}
        />
    )

    const user = userEvent.setup()
    const button = screen.getByLabelText('like this blog')
    for (let i = 0; i < 2; i++) {
        await user.click(button)
    }

    expect(mockLikeHandler.mock.calls).toHaveLength(2)

})
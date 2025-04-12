import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

test('<BlogForm /> updates parent state and calls onSubmit', async () => {

  const user = userEvent.setup()

  const mockBlog = {
    title: 'Creating a new blog',
    author: 'John Doe',
    url: 'www.example.com',
  }
  blogService.create.mockResolvedValue(mockBlog)

  const createBlog = vi.fn()

  render(<BlogForm onBlogCreated={createBlog} />)

  const titleInput = screen.getByLabelText(/title/i)
  const authorInput = screen.getByLabelText(/author/i)
  const urlInput = screen.getByLabelText(/url/i)
  const submitButton = screen.getByRole('button', { name: /create/i })

  await user.type(titleInput, mockBlog.title)
  await user.type(authorInput, mockBlog.author)
  await user.type(urlInput, mockBlog.url)

  await user.click(submitButton)

  console.log(createBlog.mock.calls, 'testi')

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith(mockBlog)

})
import '@testing-library/jest-dom/extend-expect'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('when new blog is created the form calls the event handle', () => {
  const createBlog = jest.fn()
  const { container } = render(<BlogForm createBlog={createBlog} />)
  const titleInput = container.querySelector('[name="title"]')
  userEvent.type(titleInput, 'testing title of blog')
  const authorInput = container.querySelector('[name="author"]')
  userEvent.type(authorInput, 'testing author of blog')
  const urlInput = container.querySelector('[name="url"]')
  userEvent.type(urlInput, 'testing url of blog')
  const button = screen.getByText('create')
  userEvent.click(button)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title of blog')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author of blog')
  expect(createBlog.mock.calls[0][0].url).toBe('testing url of blog')
})

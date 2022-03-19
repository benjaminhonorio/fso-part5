import '@testing-library/jest-dom/extend-expect'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders blog title and author but not number likes or url', () => {
    const blog = {
      title: 'some blog',
      author: 'some author',
      url: 'some url',
      likes: '12',
    }
    const user = {
      username: 'me',
    }
    const container = render(<Blog blog={blog} user={user} />).container
    const element = container.querySelector('.blogItem')
    expect(element.textContent).toContain(`${blog.title} ${blog.author}`)
    expect(element.textContent).toContain(`${blog.title} ${blog.author}`)
    expect(element.textContent).not.toContain(blog.url)
    expect(element.textContent).not.toContain(blog.likes)
  })
  test('renders blog likes and url when show button is clicked', () => {
    const blog = {
      title: 'some blog',
      author: 'some author',
      url: 'some url',
      likes: '12',
    }
    const user = {
      username: 'me',
    }
    render(<Blog blog={blog} user={user} />)
    const viewButton = screen.getByText('view')
    userEvent.click(viewButton)
    const likesElement = screen.getByText(`likes ${blog.likes}`, {
      exact: false,
    })
    expect(likesElement).toBeDefined()
    const urlElement = screen.getByText(blog.url, { exact: false })
    expect(urlElement).toBeDefined()
  })
  test('if like button is clicked twice, the event handler is called twice', () => {
    const blog = {
      title: 'some blog',
      author: 'some author',
      url: 'some url',
      likes: '12',
    }
    const user = {
      username: 'me',
    }

    const giveLike = jest.fn()
    render(<Blog blog={blog} user={user} updateLikes={giveLike} />)

    const viewButton = screen.getByText('view')
    userEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    userEvent.click(likeButton)
    userEvent.click(likeButton)
    expect(giveLike).toHaveBeenCalledTimes(2)
  })
})

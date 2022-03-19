import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, removeBlog, updateLikes }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [currentBlog, setCurrentBlog] = useState(() => blog)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const updateBlog = (blog) => {
    blogService
      .update(updateLikes(blog), blog.id)
      .then((returnedBlog) => {
        setCurrentBlog(returnedBlog)
      })
      .catch(() => {}) // for the test not to show unhandled error because it's trying to run the service (See Blog.test.js "if like button is clicked twice")
  }

  const deleteBlog = (id) => {
    const removeConfirm = window.confirm(
      `Remove blog ${currentBlog.title} by ${currentBlog.author}`
    )
    if (removeConfirm) {
      blogService.deleteItem(id).then((response) => {
        if (response.status === 204) {
          removeBlog(id)
        }
      })
    }
  }
  return (
    <div style={blogStyle}>
      <div className="blogItem">
        {currentBlog.title} {currentBlog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
        {showDetails ? (
          <>
            <div>{currentBlog.url}</div>
            <div>
              likes {currentBlog.likes}
              <button onClick={() => updateBlog(currentBlog)}>like</button>
            </div>
            <div>{currentBlog.author}</div>
            {currentBlog.user?.username === user.username ? (
              <button
                style={{ backgroundColor: 'tomato' }}
                onClick={() => deleteBlog(currentBlog.id)}
              >
                remove
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Blog

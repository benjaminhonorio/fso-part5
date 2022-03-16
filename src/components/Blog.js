import { useState } from 'react'
import blogServices from '../services/blogs'

const Blog = ({ blog, user, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [currentBlog, setCurrentBlog] = useState(() => blog)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const updateBlog = (id) => {
    const newBlogObject = {
      ...currentBlog,
      likes: currentBlog.likes + 1,
    }
    blogServices.update(newBlogObject, id).then((returnedBlog) => {
      setCurrentBlog(returnedBlog)
    })
  }

  const deleteBlog = (id) => {
    const removeConfirm = window.confirm(
      `Remove blog ${currentBlog.title} by ${currentBlog.author}`
    )
    if (removeConfirm) {
      blogServices.deleteItem(id).then((response) => {
        if (response.status === 204) {
          removeBlog(id)
        }
      })
    }
  }
  return (
    <div style={blogStyle}>
      <div>
        {currentBlog.title} {currentBlog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
        {showDetails ? (
          <>
            <div>{currentBlog.url}</div>
            <div>
              likes {currentBlog.likes}
              <button onClick={() => updateBlog(currentBlog.id)}>like</button>
            </div>
            <div>{currentBlog.author}</div>
            {currentBlog?.user?.username === user.username ? (
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

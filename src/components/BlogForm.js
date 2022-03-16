import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (e) => {
    e.preventDefault()
    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            onChange={({ target }) => setTitle(target.value)}
            value={title}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            onChange={({ target }) => setAuthor(target.value)}
            value={author}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            onChange={({ target }) => setUrl(target.value)}
            value={url}
          />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default BlogForm

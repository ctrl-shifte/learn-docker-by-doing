import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [cacheInfo, setCacheInfo] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/posts`)
      const data = await response.json()
      setPosts(data.posts)
      setCacheInfo(data.source)
      setError(null)
    } catch (err) {
      setError('Failed to fetch posts: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormData({ title: '', content: '', author: '' })
        setShowForm(false)
        fetchPosts()
      }
    } catch (err) {
      setError('Failed to create post: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchPosts()
      }
    } catch (err) {
      setError('Failed to delete post: ' + err.message)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1>🐳 Docker Blog Platform</h1>
          <p className="subtitle">Level 2: Multi-Service Architecture</p>
          {cacheInfo && (
            <div className={`cache-badge ${cacheInfo}`}>
              {cacheInfo === 'cache' ? '⚡ From Redis Cache' : '💾 From PostgreSQL'}
            </div>
          )}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ New Post'}
        </button>
      </header>

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {showForm && (
        <form className="post-form" onSubmit={handleSubmit}>
          <h2>Create New Post</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Post Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Post Content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
              rows="6"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Author (optional)"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Publish Post
          </button>
        </form>
      )}

      <div className="posts-grid">
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty">No posts yet. Create your first one!</div>
        ) : (
          posts.map(post => (
            <article key={post.id} className="post-card">
              <div className="post-header">
                <h2>{post.title}</h2>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(post.id)}
                  title="Delete post"
                >
                  🗑️
                </button>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-footer">
                <span className="author">By {post.author}</span>
                <span className="date">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      <footer className="footer">
        <div className="tech-stack">
          <span className="tech-badge">React</span>
          <span className="tech-badge">Node.js</span>
          <span className="tech-badge">PostgreSQL</span>
          <span className="tech-badge">Redis</span>
          <span className="tech-badge">Nginx</span>
        </div>
        <p>Built with Docker 🐳 | Level 2 Challenge</p>
      </footer>
    </div>
  )
}

export default App

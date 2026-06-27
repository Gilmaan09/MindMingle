import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const experienceTags = [
  'Anxiety', 'Depression', 'Stress', 'Work-Life Balance',
  'Relationships', 'Self-Care', 'Growth', 'Gratitude',
  'Sleep', 'Grief', 'Recovery', 'Motivation'
];

const PostCard = ({ post, onLike, onComment, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isAnon, setIsAnon] = useState(true);

  const handleComment = () => {
    if (!comment.trim()) return;
    onComment(post._id, comment, isAnon);
    setComment('');
  };

  const isLiked = post.likes?.includes(currentUserId);

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {post.displayName?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="post-meta">
          <div className="post-author">
            {post.isAnonymous ? '🔒 ' : ''}{post.displayName || 'Anonymous Friend'}
          </div>
          <div className="post-time">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
        {post.tags?.length > 0 && (
          <span className="badge badge-sage" style={{ marginLeft: 'auto' }}>
            {post.tags[0]}
          </span>
        )}
      </div>

      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        <button
          className={`post-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post._id)}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes?.length || 0}
        </button>
        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.comments?.length || 0} Comments
        </button>
        {/* <button className="post-action-btn" style={{ marginLeft: 'auto' }}>
          🔗 Share
        </button> */}
      </div>

      {showComments && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--cream-dark)' }}>
          {post.comments?.map((c, i) => (
            <div key={i} style={{
              display: 'flex', gap: '10px', marginBottom: '12px'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--lavender), var(--sky))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0
              }}>
                {c.displayName?.charAt(0) || 'A'}
              </div>
              <div style={{
                background: 'var(--cream)', borderRadius: 'var(--radius-sm)',
                padding: '10px 14px', flex: 1
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>
                  {c.isAnonymous ? '🔒 ' : ''}{c.displayName || 'Anonymous'}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--charcoal-soft)' }}>{c.content}</div>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Add a supportive comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
            />
            <button className="btn btn-primary btn-sm" onClick={handleComment}>
              Send
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--warm-gray)' }}>
            <input
              type="checkbox"
              checked={isAnon}
              onChange={e => setIsAnon(e.target.checked)}
            />
            Comment anonymously
          </label>
        </div>
      )}
    </div>
  );
};

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ content: '', tags: [], isAnonymous: true });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/community');
      setPosts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!form.content.trim()) return toast.error('Please write something');
    if (form.content.length < 10) return toast.error('Post is too short');
    setSubmitting(true);
    try {
      await axios.post('/api/community', form);
      toast.success('Post shared with the community 💚');
      setForm({ content: '', tags: [], isAnonymous: true });
      setShowCreate(false);
      fetchPosts();
    } catch {
      toast.error('Failed to post');
    } finally {
      setSubmitting(false);
    }
  };

  const likePost = async (id) => {
    try {
      await axios.put(`/api/community/${id}/like`);
      fetchPosts();
    } catch { }
  };

  const addComment = async (postId, content, isAnonymous) => {
    try {
      await axios.post(`/api/community/${postId}/comment`, { content, isAnonymous });
      toast.success('Comment added!');
      fetchPosts();
    } catch {
      toast.error('Failed to comment');
    }
  };

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  };

  const filtered = posts.filter(p =>
    !search || p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="community-page">
      <div className="page-header community-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Community Support</h2>
          <p style={{ fontSize: '0.95rem' }}>A safe, anonymous space to share experiences and feel less alone</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)} style={{ whiteSpace: 'nowrap', marginTop: '4px' }}>
          {showCreate ? '✕ Close' : '✍️ Share Thoughts'}
        </button>
      </div>

      {/* Safety banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,159,138,0.08), rgba(158,196,208,0.1))',
        border: '1.5px solid rgba(124,159,138,0.2)',
        borderRadius: 'var(--radius-md)', padding: '16px 20px',
        marginBottom: '28px', fontSize: '0.875rem', color: 'var(--charcoal-soft)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <span style={{ fontSize: '1.3rem' }}>🛡️</span>
        <div>
          <strong style={{ color: 'var(--sage-dark)' }}>Safe & Supportive</strong> — All posts are anonymous by default. Be kind and respectful. If you're in crisis, please reach out to a professional.
        </div>
      </div>

      {/* Create Post */}
      {showCreate && (
        <div className="card community-composer" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, rgba(248,241,232,0.8), var(--white))' }}>
          <h3 style={{ marginBottom: '4px', fontSize: '1.3rem' }}>Share with the Community</h3>
          <p style={{ color: 'var(--warm-gray)', fontSize: '0.85rem', marginBottom: '20px' }}>Write from the heart. Your thoughts matter.</p>

          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              placeholder="Share your thoughts, experiences, or ask for support..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              style={{ minHeight: '140px', borderRadius: 'var(--radius-md)', fontSize: '0.95rem' }}
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', marginTop: '8px', textAlign: 'right' }}>
              <span style={{ opacity: form.content.length > 800 ? 1 : 0.6 }}>{form.content.length}/1000</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '10px', fontWeight: '600' }}>What's on your mind? (optional tags)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {experienceTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem',
                    border: form.tags.includes(tag) ? 'none' : '1.5px solid var(--cream-dark)',
                    background: form.tags.includes(tag) ? 'linear-gradient(135deg, var(--sage-dark), var(--sage))' : 'var(--white)',
                    color: form.tags.includes(tag) ? 'white' : 'var(--warm-gray)',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
                    boxShadow: form.tags.includes(tag) ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={e => setForm(f => ({ ...f, isAnonymous: e.target.checked }))}
                style={{ cursor: 'pointer' }}
              />
              <span>Post anonymously (recommended)</span>
            </label>
            <button className="btn btn-primary" onClick={createPost} disabled={submitting} style={{ minWidth: '140px' }}>
              {submitting ? '⏳ Posting...' : '✓ Share Post'}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '28px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Search conversations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '440px', fontSize: '0.95rem', padding: '12px 16px' }}
        />
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🤝</div>
          <h3>No posts yet</h3>
          <p>Be the first to share with the community</p>
        </div>
      ) : (
        filtered.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onLike={likePost}
            onComment={addComment}
            currentUserId={user?._id}
          />
        ))
      )}
    </div>
  );
};

export default Community;

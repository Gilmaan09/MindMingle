const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/community - Get posts
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, search } = req.query;
    const query = { isHidden: false };

    if (tag) query.tags = tag;
    if (search) query.content = { $regex: search, $options: 'i' };

    const posts = await Post.find(query)
      .populate('author', 'name avatar anonymousName isAnonymous')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Anonymize authors
    const anonymizedPosts = posts.map(post => {
      const p = post.toObject();
      if (p.isAnonymous) {
        p.author = {
          _id: p.author._id,
          name: p.author.anonymousName || 'Anonymous Friend',
          avatar: null
        };
      }
      return p;
    });

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: anonymizedPosts,
      pagination: { total, pages: Math.ceil(total / limit), page: parseInt(page) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/community - Create post
router.post('/', protect, async (req, res) => {
  try {
    const { content, tags, sharedExperiences, isAnonymous } = req.body;

    const user = await User.findById(req.user._id);
    const displayName = isAnonymous 
      ? (user.anonymousName || `Anonymous${Math.floor(Math.random() * 9999)}`) 
      : user.name;

    const post = await Post.create({
      author: req.user._id,
      content,
      tags,
      sharedExperiences,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
      displayName
    });

    const populatedPost = await post.populate('author', 'name avatar anonymousName');
    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/community/:id/like - Like/unlike post
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ success: true, likes: post.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/community/:id/comment - Add comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const user = await User.findById(req.user._id);
    const displayName = isAnonymous ? (user.anonymousName || 'Anonymous Friend') : user.name;

    post.comments.push({
      author: req.user._id,
      displayName,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
      content
    });

    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/community/:id/report - Report post
router.post('/:id/report', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (!post.reportedBy.includes(req.user._id)) {
      post.reportedBy.push(req.user._id);
      if (post.reportedBy.length >= 5) post.isHidden = true;
      await post.save();
    }

    res.json({ success: true, message: 'Post reported' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

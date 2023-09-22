import express from 'express';
import {
  deleteBlog,
  getAllBlogs,
  postBlog,
  updateBlog,
  getSingleBlog,
  getBlogsByUser,
  // likeBlog,
} from '../controllers/blog.js';

import { protect } from '../middleware/protect.js';

const router = express.Router();

router.get('/public', getAllBlogs);

router.get('/', protect, getBlogsByUser);

router.post('/', protect, postBlog);

router.get('/:id', protect, getSingleBlog);

router.put('/:id', protect, updateBlog);

router.delete('/:id', protect, deleteBlog);

// router.post('/like', protect, likeBlog);

export default router;

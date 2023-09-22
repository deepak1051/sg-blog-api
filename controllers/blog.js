import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog.js';

// const getSingleBlogData = async (blog_id, user_id) => {
//   const blog = await pool.query(
//     'SELECT blogs.id,username,title,body,imageurl FROM blogs JOIN users ON users.id=blogs.user_id WHERE blogs.id=$1 ',
//     [blog_id]
//   );
//   const _count_likes = await pool.query(
//     'SELECT blog_id ,COUNT(*) FROM likes GROUP BY blog_id HAVING blog_id=$1;',
//     [blog_id]
//   );

//   const isLiked = await pool.query(
//     'SELECT * FROM likes WHERE blog_id=$1 AND user_id=$2',
//     [blog_id, user_id]
//   );

//   const result = {
//     ...blog.rows[0],
//     like_count: parseInt(_count_likes.rows[0]?.count || 0),
//     isLiked: isLiked.rows.length ? true : false,
//   };

//   return result;
// };

const getBlogsByUser = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id });
  res.status(200).json(blogs);
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const allBlogs = await Blog.find({}).populate('author');
  res.status(200).json(allBlogs);
});

const postBlog = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { title, summary, content, cover } = req.body;

  if (!title || !summary || !content || !cover) {
    res.status(400);
    throw new Error('Please add all fields.');
  }
  const blog = await Blog.create({
    title,
    summary,
    content,
    cover,
    author: req.user._id,
  });

  res.status(201).json(blog);
});

const getSingleBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author');

  res.status(200).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, cover } = req.body;
  if (!title || !summary || !content || !cover) {
    res.status(400);
    throw new Error('Please add all fields.');
  }

  const _blog = await Blog.findById(id);

  if (!_blog) {
    res.status(401);
    throw new Error('The blog with the given ID was not found.');
  }

  if (_blog.author !== req.user._id) {
    res.status(401);
    throw new Error('You are not authorized to do it');
  }

  const blog = await Blog.findByIdAndUpdate(
    id,
    { title, summary, content, cover },
    { new: true }
  );

  res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const _blog = await Blog.findById(id);

  if (!_blog) {
    res.status(401);
    throw new Error('The goal with the given ID was not found.');
  }

  if (_blog.author !== req.user._id) {
    res.status(401);
    throw new Error('You are not authorized to do it');
  }

  const blog = await Blog.findByIdAndDelete(id);

  res.status(200).json({ id: blog.id });
});

// const likeBlog = asyncHandler(async (req, res) => {
//   const { blogId } = req.body;
//   if (!blogId) {
//     res.status(400);
//     throw new Error('blogId is required');
//   }

//   const _blog = await pool.query('SELECT * FROM blogs WHERE id=$1', [blogId]);

//   if (!_blog.rows.length) {
//     res.status(401);
//     throw new Error('Blog not found');
//   }

//   const isLiked = await pool.query(
//     'SELECT * FROM likes WHERE blog_id=$1 AND user_id=$2',
//     [blogId, req.user.id]
//   );

//   if (isLiked.rows.length) {
//     // res.status(400);
//     // throw new Error('Already liked blog by this user');
//     await pool.query('DELETE FROM likes WHERE blog_id=$1 AND user_id=$2', [
//       blogId,
//       req.user.id,
//     ]);
//     return res.status(200).json('unliked blog');
//   }

//   const liked = await pool.query(
//     'INSERT INTO likes (blog_id,user_id) VALUES($1,$2)',
//     [blogId, req.user.id]
//   );
//   res.status(200).json('liked blog');
// });

export {
  getBlogsByUser,
  getAllBlogs,
  postBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
  // likeBlog,
};

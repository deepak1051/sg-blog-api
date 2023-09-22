import asyncHandler from 'express-async-handler';

import Comment from '../models/Comment.js';

const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { blogId } = req.params;

  if (!text) {
    res.status(400);
    throw new Error('Please add a comment text.');
  }

  const comment = await Comment.create({
    text,
    blog: blogId,
    author: req.user._id,
    authorName: req.user.name,
  });

  res.status(201).json(comment);
});

const getComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const comments = await Comment.find({ blog: blogId });

  res.status(200).json(comments);
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    res.status(404);
    throw new Error('comment id is not provided.');
  }

  const _comment = await Comment.findById(commentId);

  if (!_comment) {
    res.status(401);
    throw new Error('comment not found');
  }

  if (_comment.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not authorized to do it');
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  res.status(200).json(comment);
});

export { createComment, getComments, deleteComment };

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

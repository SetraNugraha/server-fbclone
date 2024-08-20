import CommentModel from '../models/CommentModel.js'

const getAllComments = async (req, res) => {
  try {
    const allComments = await CommentModel.getAllComments()

    res.json({
      msg: 'Get All Comment Success',
      data: allComments,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const getAllCommentsByPostId = async (req, res) => {
  const postId = req.params.postId

  try {
    const commentsByPostId = await CommentModel.getAllCommentsByPostId(parseInt(postId))

    res.json({
      msg: 'Get Comments By Post Id Success',
      data: commentsByPostId,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const createCommentByPostId = async (req, res) => {
  const data = req.body

  try {
    const createNewComment = await CommentModel.createCommentByPostId(data)

    res.json({
      msg: 'Create Comment Success',
      data: createNewComment,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params

  try {
    await CommentModel.deleteComment(parseInt(postId), parseInt(commentId))

    res.json({
      msg: 'Delete Comment Success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

export default {
  getAllComments,
  getAllCommentsByPostId,
  createCommentByPostId,
  deleteComment,
}

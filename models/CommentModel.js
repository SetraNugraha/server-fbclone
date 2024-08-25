import prisma from '../config/database.js'

const getComments = async (filter = {}) => {
  const comments = await prisma.comments.findMany({
    where: filter,
  })

  if (!comments) {
    throw Error('Comments Not Found !')
  }

  return comments
}

const getAllComments = () => getComments()
const getAllCommentsByPostId = (postId) => getComments({ post_id: postId })

const createCommentByPostId = async (data) => {
  const createNewComment = await prisma.comments.create({
    data: {
      post_id: data.post_id,
      user_id: data.user_id,
      body: data.body,
    },
  })

  if (!createNewComment) {
    throw Error('Error While Creating Comment !')
  }

  return createNewComment
}

const deleteComment = async (postId, commentId) => {
  const deletedComment = await prisma.comments.delete({
    where: {
      id: commentId,
      post_id: postId,
    },
  })

  if (!deletedComment) {
    throw Error('Error While Deleting Comment !')
  }

  return deleteComment
}

export default {
  getAllComments,
  getAllCommentsByPostId,
  createCommentByPostId,
  deleteComment,
}

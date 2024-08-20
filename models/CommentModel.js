import prisma from '../config/database.js'

const getAllComments = async () => {
  const allComments = await prisma.comments.findMany()

  if (!allComments) {
    throw Error('Comments Not Found !')
  }

  return allComments
}

const getAllCommentsByPostId = async (postId) => {
  const commentsByPostId = await prisma.comments.findMany({
    where: {
      post_id: postId,
    },
  })

  if (!commentsByPostId) {
    throw Error('Comments Not Found !')
  }

  return commentsByPostId
}

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

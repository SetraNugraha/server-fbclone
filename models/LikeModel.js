import prisma from '../config/database.js'

const getAllLike = async () => {
  const allLike = await prisma.likes.findMany()

  if (!allLike) {
    throw Error('Like Not Found !')
  }

  return allLike
}

const createLike = async (postId, userId) => {
  const existingLike = await prisma.likes.findFirst({
    where: {
      post_id: postId,
      user_id: userId,
    },
  })

  if (existingLike) {
    throw Error('User already liked this post.')
  }

  const createLike = await prisma.likes.create({
    data: {
      post_id: postId,
      user_id: userId,
    },
  })

  return createLike
}

const deleteLike = async (postId, userId) => {
  const existingLike = await prisma.likes.findFirst({
    where: {
      post_id: postId,
      user_id: userId,
    },
  })

  if (existingLike) {
    const deleteLike = await prisma.likes.deleteMany({
      where: {
        post_id: postId,
        user_id: userId,
      },
    })
    return deleteLike
  } else {
    throw Error('Like does not exist.')
  }
}

export default {
  getAllLike,
  createLike,
  deleteLike,
}

import prisma from '../config/database.js'
import fs from 'fs'
import path from 'path'

const getAllPost = async () => {
  const allPost = await prisma.posts.findMany({
    orderBy: {
      created_at: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          surname: true,
          profile_image: true,
        },
      },
      comment: {
        select: {
          body: true,
          created_at: true,
          user: {
            select: {
              id: true,
              first_name: true,
              surname: true,
              profile_image: true,
            },
          },
        },
      },
      like: true,
    },
  })

  return allPost
}

const getAllPostByUserId = async (userId) => {
  const allPostByUserId = await prisma.posts.findMany({
    orderBy: {
      created_at: 'desc',
    },
    where: {
      user_id: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          surname: true,
          profile_image: true,
        },
      },
      comment: {
        select: {
          body: true,
          created_at: true,
          user: {
            select: {
              id: true,
              first_name: true,
              surname: true,
              profile_image: true,
            },
          },
        },
      },
      like: true,
    },
  })

  return allPostByUserId
}

const unlinkPostImage = async (post_image) => {
  if (post_image) {
    // Define the full path to the image file
    const imagePath = path.join(__dirname, 'public', 'img', 'post_images', post_image)

    // Delete the image file from the filesystem
    await new Promise((resolve, reject) => {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image file: ${err}`)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

const createPost = async (newDataPost) => {
  const { user_id, body, post_image } = newDataPost

  const newPost = await prisma.posts.create({
    data: {
      user_id: user_id,
      body: body,
      post_image: post_image,
    },
  })

  if (!newPost) {
    throw Error('Error While Creating Post !')
  }

  return newPost
}

const deletePost = async (postId, userId) => {
  const getPostByUserId = await prisma.posts.findFirst({
    where: {
      id: postId,
      user_id: userId,
    },
  })

  if (!getPostByUserId) {
    throw Error('Post Not Found or You Not Authorized to Delete This Post !')
  }

  // Extract the image filename from the post
  const { post_image } = getPostByUserId

  await unlinkPostImage(post_image)

  const deletedPost = await prisma.posts.delete({
    where: {
      id: postId,
    },
  })

  return deletedPost
}

export default { getAllPost, getAllPostByUserId, createPost, deletePost }

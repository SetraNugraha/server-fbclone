import prisma from '../config/database.js'
import fs from 'fs'
import path from 'path'

const getAllUsers = async () => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      first_name: true,
      surname: true,
      email: true,
      birthday: true,
      gender: true,
    },
  })
  return users
}

const getUserByEmail = async (email) => {
  const userByEmail = await prisma.users.findUnique({
    where: {
      email: email,
    },
  })

  if (!userByEmail) {
    throw Error('Email Not Found !')
  }

  return userByEmail
}

const getUserById = async (id) => {
  const userById = await prisma.users.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      first_name: true,
      surname: true,
      profile_image: true,
    },
  })

  return userById
}

const getUserByToken = async (token) => {
  const userByToken = await prisma.users.findFirst({
    where: {
      refresh_token: token,
    },
  })

  return userByToken
}

const unlinkProfileImage = async (profile_image) => {
  if (profile_image) {
    // Define the full path to the image file
    const imagePath = path.join(__dirname, 'public', 'img', 'profile_images', profile_image)

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

const updateProfileImage = async (id, profileImage) => {
  const findProfileImageUser = await prisma.users.findFirst({
    where: {
      id: id,
    },
  })

  if (!findProfileImageUser) {
    throw Error('Error While Updating Profile Image')
  }

  const { profile_image } = findProfileImageUser

  await unlinkProfileImage(profile_image)

  const updateProfileImage = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      profile_image: profileImage,
      update_at: new Date(),
    },
  })

  return updateProfileImage
}

const deleteProfileImage = async (id) => {
  const findProfileImageUser = await prisma.users.findFirst({
    where: {
      id: id,
    },
  })

  if (!findProfileImageUser) {
    throw Error('Error While Updating Profile Image')
  }

  const { profile_image } = findProfileImageUser

  await unlinkProfileImage(profile_image)

  const deleteImage = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      profile_image: null,
      update_at: new Date(),
    },
  })

  return deleteImage
}

export default { getAllUsers, getUserByEmail, getUserById, updateProfileImage, getUserByToken, deleteProfileImage }

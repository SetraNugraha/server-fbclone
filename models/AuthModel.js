import prisma from '../config/database.js'
import bcrypt from 'bcrypt'

const createUser = async (newUserData) => {
  const { first_name, surname, email, password, birthday, gender } = newUserData
  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)

  // Check Exist Email
  const existEmail = await prisma.users.findUnique({
    where: {
      email: email.toLowerCase().trim(),
    },
  })

  if (existEmail) {
    throw Error('Email Already Exist !')
  }

  const newUser = await prisma.users.create({
    data: {
      first_name: first_name.trim(),
      surname: surname.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword,
      birthday: birthday,
      gender: gender,
      profile_image: null,
    },
  })

  if (!newUser) {
    throw Error('Error while creating an account !')
  }

  return newUser
}

const updateRefreshToken = async (token, id) => {
  const refreshToken = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      refresh_token: token,
    },
  })

  return refreshToken
}

const removeRefreshToken = async (id) => {
  const removeToken = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      refresh_token: null,
    },
  })

  return removeToken
}

export default { createUser, updateRefreshToken, removeRefreshToken }

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import AuthModel from '../models/AuthModel.js'
import UserModel from '../models/UserModel.js'

const register = async (req, res) => {
  // Validation
  await body('first_name').notEmpty().withMessage('First Name is required').run(req)
  await body('surname').notEmpty().withMessage('Surname is required').run(req)
  await body('email').isEmail().withMessage('Invalid Email Format').run(req)
  await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 character').run(req)
  await body('birthday').notEmpty().withMessage('Birthday is required').run(req)
  await body('gender').notEmpty().withMessage('Gender is required').run(req)

  const errors = validationResult(req)
  // Jika errors tidak kosong
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    })
  }

  const newUserData = req.body
  try {
    const newUser = await AuthModel.createUser(newUserData)
    res.json({
      msg: 'Success Create Account',
      data: newUser,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const login = async (req, res) => {
  try {
    // If user not filled in email & password
    if (req.body.email === '' && req.body.password === '') {
      return res.status(400).json({
        msg: 'Email & Password must be filled in !',
      })
    }

    // Find Email
    const user = await UserModel.getUserByEmail(req.body.email)

    // Compare Password
    const matchPassword = await bcrypt.compare(req.body.password, user.password)
    if (!matchPassword) {
      return res.status(400).json({
        msg: 'Incorrect Password ! Please Check and Try Again',
      })
    }

    const { id, first_name, surname, email, birthday, gender, profile_image } = user
    const payload = {
      id: id,
      first_name: first_name,
      surname: surname,
      email: email,
      birthday: birthday,
      gender: gender,
      profile_image: profile_image,
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20s',
    })

    const refreshToken = jwt.sign({ id, first_name, email, birthday }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

    await AuthModel.updateRefreshToken(refreshToken, id)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Hour * minute * second * mili second = 1 Day
    })

    res.json({
      msg: 'login Success',
      accessToken,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.sendStatus(401)
    }

    const user = await UserModel.getUserByToken(refreshToken)
    if (!user) {
      return res.sendStatus(403)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(403)
      }
    })

    const { id, first_name, surname, email, birthday, gender, profile_image } = user
    const payload = {
      id: id,
      first_name: first_name,
      surname: surname,
      email: email,
      birthday: birthday,
      gender: gender,
      profile_image: profile_image,
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20s',
    })

    res.json({
      accessToken,
    })
  } catch (error) {
    res.status(400).json(error.message)
  }
}

const logout = async (req, res) => {
  // Cek refresh Token on Cookie
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return res.sendStatus(401)
  }

  const user = await UserModel.getUserByToken(refreshToken)
  if (!user) {
    return res.sendStatus(204)
  }

  const userId = user.id
  await AuthModel.removeRefreshToken(userId)

  res.clearCookie('refreshToken')
  return res.sendStatus(200)
}

export default { register, login, refreshToken, logout }

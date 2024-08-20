import UserModel from '../models/UserModel.js'

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers()
    res.json({
      msg: 'Get All Users Success',
      data: users,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id)

  if (!id) {
    return res.status(400).json({
      msg: 'user not found !',
    })
  }

  try {
    const userById = await UserModel.getUserById(id)

    res.json({
      msg: 'Get User By Id Success',
      data: userById,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded')
    }

    const id = parseInt(req.params.id)
    const profileImage = req.file.filename

    const updateProfile = await UserModel.updateProfileImage(id, profileImage)

    res.json({
      msg: 'Update Success',
      data: updateProfile,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const deleteProfileImage = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({
      msg: 'Invalid User ID !',
    })
  }

  try {
    await UserModel.deleteProfileImage(id)
    res.json({
      msg: 'Profile Image Deleted !',
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

export default { getAllUsers, getUserById, updateProfileImage, deleteProfileImage }

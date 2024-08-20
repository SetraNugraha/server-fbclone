import LikeModel from '../models/LikeModel.js'

const getAllLike = async (req, res) => {
  try {
    const response = await LikeModel.getAllLike()
    res.json({
      msg: 'Get All Like Success',
      data: response,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const createLike = async (req, res) => {
  const { postId, userId } = req.params
  try {
    await LikeModel.createLike(parseInt(postId), parseInt(userId))
    res.json({
      msg: 'create Like Success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const deleteLike = async (req, res) => {
  const { postId, userId } = req.params

  try {
    await LikeModel.deleteLike(parseInt(postId), parseInt(userId))
    res.json({
      msg: 'Delete Like Success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

export default {
  getAllLike,
  createLike,
  deleteLike,
}

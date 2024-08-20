import PostModel from '../models/PostModel.js'

const getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.getAllPost()
    res.json({
      msg: 'Get All Post Success',
      data: posts,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const getAllPostByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId)

  if (typeof userId !== 'number') {
    return res.status(400).json({
      msg: 'ID must be number !',
    })
  }

  try {
    const allPostByUserId = await PostModel.getAllPostByUserId(userId)

    res.json({
      msg: 'Get post By ID Success',
      data: allPostByUserId,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const createPost = async (req, res) => {
  const newDataPost = req.body
  const post_image = req.file ? req.file.filename : null

  newDataPost.user_id = parseInt(newDataPost.user_id)

  try {
    const newPost = await PostModel.createPost({ ...newDataPost, post_image: post_image })
    res.json({
      msg: 'Post Created',
      data: newPost,
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

const deletePost = async (req, res) => {
  const { postId, userId } = req.params

  try {
    await PostModel.deletePost(parseInt(postId), parseInt(userId))

    res.json({
      msg: 'Delete Post Success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }
}

export default { getAllPost, getAllPostByUserId, createPost, deletePost }

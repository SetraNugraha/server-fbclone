import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { postImageUpload } from '../middleware/postImageUpload.js'
import { profileImageUpload } from '../middleware/profileImageUpload.js'
import AuthController from '../controllers/AuthController.js'
import UserController from '../controllers/UserController.js'
import PostController from '../controllers/PostController.js'
import CommentController from '../controllers/CommentController.js'
import LikeController from '../controllers/LikeController.js'

const router = express.Router()

//! Auth
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/token', AuthController.refreshToken)
router.delete('/logout', AuthController.logout)

//! User
router.get('/users/:id', UserController.getUserById)
router.put('/users/:id', verifyToken, profileImageUpload.single('profile_image'), UserController.updateProfileImage)
router.delete('/users/:id', verifyToken, UserController.deleteProfileImage)

//! Posts
router.get('/api/posts', PostController.getAllPost)
router.get('/posts/:userId', PostController.getAllPostByUserId)
router.post('/posts', verifyToken, postImageUpload.single('post_image'), PostController.createPost)
router.delete('/posts/:postId/:userId', verifyToken, PostController.deletePost)

//! Comments
router.post('/posts/comments', verifyToken, CommentController.createCommentByPostId)
router.delete('/posts/:postId/comments/:commentId', verifyToken, CommentController.deleteComment)

//! Like
router.post('/posts/:postId/users/:userId', verifyToken, LikeController.createLike)
router.delete('/posts/:postId/users/:userId', verifyToken, LikeController.deleteLike)

export default router

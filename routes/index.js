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
router.post('/api/register', AuthController.register)
router.post('/api/login', AuthController.login)
router.get('/api/token', AuthController.refreshToken)
router.delete('/api/logout', AuthController.logout)

//! User
router.get('/api/users/:id', UserController.getUserById)
router.put('/api/users/:id', verifyToken, profileImageUpload.single('profile_image'), UserController.updateProfileImage)
router.delete('/api/users/:id', verifyToken, UserController.deleteProfileImage)

//! Posts
router.get('/api/posts', PostController.getAllPost)
router.get('/api/posts/:userId', PostController.getAllPostByUserId)
router.post('/api/posts', verifyToken, postImageUpload.single('post_image'), PostController.createPost)
router.delete('/api/posts/:postId/:userId', verifyToken, PostController.deletePost)

//! Comments
router.post('/api/posts/comments', verifyToken, CommentController.createCommentByPostId)
router.delete('/api/posts/:postId/comments/:commentId', verifyToken, CommentController.deleteComment)

//! Like
router.post('/api/posts/:postId/users/:userId', verifyToken, LikeController.createLike)
router.delete('/api/posts/:postId/users/:userId', verifyToken, LikeController.deleteLike)

export default router

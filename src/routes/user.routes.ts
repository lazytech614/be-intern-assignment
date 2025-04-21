import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';
import { UserController } from '../controllers/user.controller';
import { authenticateUser } from '../middleware/authentication.middleware';

export const userRouter = Router();
const userController = new UserController();

// Get all users
userRouter.get('/', userController.getAllUsers.bind(userController));

// get feed
userRouter.get('/feed', authenticateUser, userController.getPersonalizedFeed.bind(userController));

// Get all my followers
userRouter.get('/followers', authenticateUser, userController.getFollowers.bind(userController));

// Get activity
userRouter.get('/activity', userController.getUserActivities.bind(userController));

// Get user by id
userRouter.get('/:id', userController.getUserById.bind(userController));

// Create new user
userRouter.post('/', validate(createUserSchema), userController.createUser.bind(userController));

// Update user
userRouter.put('/update', authenticateUser, validate(updateUserSchema), userController.updateUser.bind(userController));

// Delete user
userRouter.delete('/:id', userController.deleteUser.bind(userController));

// Follow a user
userRouter.post('/:id/follow', authenticateUser, userController.followUser.bind(userController));

// Unfollow a user
userRouter.post('/:id/unfollow', authenticateUser, userController.unfollowUser.bind(userController));

// Like a post
userRouter.post('/:id/like', authenticateUser, userController.likePost.bind(userController));

// Unlike a post
userRouter.post('/:id/unlike', authenticateUser, userController.unlikePost.bind(userController));




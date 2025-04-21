// src/routes/post.routes.ts
import { Router } from 'express';  
import { validate } from '../middleware/validation.middleware';  
import { createPostSchema, updatePostSchema } from '../validations/post.validation';  
import { PostController } from '../controllers/post.controller';  
import { authenticateUser } from '../middleware/authentication.middleware';

export const postRouter = Router();  
const postController = new PostController();  

// List all posts  
postRouter.get(
  '/',  
  postController.getAllPosts.bind(postController)  
);

// Get posts by hashtags
postRouter.get(
  '/hashtag/:tag',
  postController.getPostsByHashtag.bind(postController)
);

// Get a single post by ID  
postRouter.get(
  '/:id',  
  postController.getPostById.bind(postController)  
);

// Create a new post  
postRouter.post(
  '/',  
  validate(createPostSchema),  
  authenticateUser,
  postController.createPost.bind(postController)  
);

// Update an existing post  
postRouter.put(
  '/:id',  
  validate(updatePostSchema),  
  authenticateUser,
  postController.updatePost.bind(postController)  
);

// Delete a post  
postRouter.delete(
  '/:id',  
  authenticateUser,
  postController.deletePost.bind(postController)  
);



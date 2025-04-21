import { Request, Response } from 'express';
import { Users } from '../entities/User';
import { Post } from '../entities/Post';
import { Like } from '../entities/Like';
import { AppDataSource } from '../data-source';

export class UserController {
  private userRepository = AppDataSource.getRepository(Users);
  private postRepository = AppDataSource.getRepository(Post);
  private likeRepository = AppDataSource.getRepository(Like);

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await this.userRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }

  // Follow a user
  async followUser(req: Request, res: Response) {
    // const { followerId, followingId } = req.body;
    // console.log(req.userId);
    const followerId = req.userId; // Authentication middleware sets userId
    const followingId = parseInt(req.params.id, 10);
    console.log("followerId", followerId);
    console.log("followingId", followingId);

    if (followerId === followingId) {
      return res.status(400).json({ message: "Users cannot follow themselves." });
    }

    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['followings'],
    });

    const following = await this.userRepository.findOneBy({ id: followingId });

    if (!follower || !following) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if already following
    if (follower.followings.some(user => user.id === following.id)) {
      return res.status(400).json({ message: "Already following this user." });
    }

    follower.followings.push(following);
    await this.userRepository.save(follower);

    return res.status(200).json({ message: "Successfully followed the user." });
  }

  // Unfollow a user
  async unfollowUser(req: Request, res: Response) {
    // const { followerId, followingId } = req.body;

    const followerId = req.userId; // Authentication middleware sets userId
    const followingId = parseInt(req.params.id, 10);

    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['followings'],
    });

    if (!follower) {
      return res.status(404).json({ message: "Follower not found." });
    }

    follower.followings = follower.followings.filter(user => user.id !== followingId);
    await this.userRepository.save(follower);

    return res.status(200).json({ message: "Successfully unfollowed the user." });
  }

  // Like a post
  async likePost(req: Request, res: Response) {
    const postId = parseInt(req.params.id);
    const userId = req.userId;
  
    if (!postId || !userId) {
      return res.status(400).json({ message: 'Invalid post ID or user ID' });
    }
  
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
  
    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });
  
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }
  
    const like = this.likeRepository.create({ postId, userId });
    await this.likeRepository.save(like);
  
    return res.status(200).json({ message: 'Post liked successfully' });
  }
  
  // Unlike a post
  async unlikePost(req: Request, res: Response) {
    const postId = parseInt(req.params.id);
    const userId = req.userId;
  
    if (!postId || !userId) {
      return res.status(400).json({ message: 'Invalid post ID or user ID' });
    }
  
    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });
  
    if (!existingLike) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }
  
    await this.likeRepository.remove(existingLike);
  
    return res.status(200).json({ message: 'Post unliked successfully' });
  }
  
}

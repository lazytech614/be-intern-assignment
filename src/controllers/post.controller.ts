import { Request, Response } from 'express';
import { Post } from '../entities/Post';
import { Hashtag } from '../entities/Hashtag';
import { AppDataSource } from '../data-source';
import { Users } from '../entities/User';
import { Activity } from '../entities/Activity';
import { ActivityType } from '../entities/Activity';

export class PostController {
  private postRepository = AppDataSource.getRepository(Post);
  private hashtagRepository = AppDataSource.getRepository(Hashtag);
  private userRepository = AppDataSource.getRepository(Users);
  private activityRepository = AppDataSource.getRepository(Activity)

  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await this.postRepository.find({
        relations: ['author', 'hashtags', 'likes'],
        order: { createdAt: 'DESC' }
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: parseInt(req.params.id, 10) },
        relations: ['author', 'hashtags', 'likes']
      });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error });
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const { content, hashtags } = req.body;
      const authorId = req.userId;

      if (!authorId) {
        return res.status(400).json({ message: 'Author ID is missing from request' });
      }

      // Fetch the author from the database
      const author = await this.userRepository.findOne({ where: { id: authorId } });

      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }

      // Create a new Post instance
      const post = new Post();
      post.content = content;
      post.author = author;

      // Process hashtags if provided
      if (Array.isArray(hashtags)) {
        post.hashtags = [];

        for (const tagText of hashtags) {
          const normalizedTag = tagText.replace(/^#/, ''); // Remove # if present
          // Check if the hashtag already exists
          let hashtag = await this.hashtagRepository.findOne({ where: { tag: normalizedTag } });
        
          // If not, create a new one
          if (!hashtag) {
            hashtag = new Hashtag();
            hashtag.tag = normalizedTag;
            await this.hashtagRepository.save(hashtag);
          }
        
          post.hashtags.push(hashtag);
        }
        
      }

      // Save the post
      const result = await this.postRepository.save(post);

      // Log activity for post creation
      const activity = new Activity();
      activity.userId = author.id;
      activity.type = ActivityType.POST_CREATED;
      activity.referenceId = result.id; // Reference the newly created post

      // Save the activity
      await this.activityRepository.save(activity);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const authorId = req.userId;

      if(!authorId) {
        return res.status(400).json({ message: 'Author ID is missing from request' });
      }

      const post = await this.postRepository.findOneBy({
        id: parseInt(req.params.id, 10),
        author: { id: authorId }
      });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      this.postRepository.merge(post, req.body);
      const result = await this.postRepository.save(post);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating post', error });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const authorId = req.userId;

      if(!authorId) {
        return res.status(400).json({ message: 'Author ID is missing from request' });
      }

      // const result = await this.postRepository.delete(parseInt(req.params.id, 10));
      const post = await this.postRepository.findOneBy({
        id:parseInt(req.params.id),
        author: { id: authorId },
      });
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found or unauthorized' });
      }
      
      await this.postRepository.remove(post);

      res.status(204).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error });
    }
  }
  
  async getPostsByHashtag(req: Request, res: Response) {
    try {
      const { tag } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      // Fetch the hashtag entity
      const hashtag = await this.hashtagRepository.findOne({
        where: { tag },
        relations: ['posts'],
      });

      if (!hashtag) {
        return res.status(404).json({ message: 'Hashtag not found' });
      }

      // Fetch posts associated with the hashtag
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.likes', 'like')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .where('hashtag.tag = :tag', { tag })
        .orderBy('post.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      // Format the response
      const formattedPosts = posts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        author: {
          id: post.author.id,
          firstName: post.author.firstName,
          lastName: post.author.lastName,
        },
        likeCount: post.likes.length,
        hashtags: post.hashtags.map((tag) => tag.tag),
      }));

      return res.status(200).json({
        posts: formattedPosts,
        pagination: {
          limit,
          offset,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts by hashtag', error });
    }
  }
}

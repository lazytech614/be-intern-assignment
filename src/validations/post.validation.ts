// src/validations/post.validation.ts
import Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string()
    .required()
    .min(1)
    .messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 1 character long',
    }),
  
  hashtags: Joi.array()
    .items(
      Joi.string()
        .pattern(/^#[A-Za-z0-9_]+$/)
        .messages({
          'string.pattern.base': 'Each hashtag must start with "#" and contain only letters, numbers, or underscores',
        })
    )
    .optional()
    .messages({
      'array.base': 'Hashtags must be an array of strings',
    }),
});

export const updatePostSchema = Joi.object({
    content: Joi.string()
      .min(1)
      .messages({
        'string.min': 'Content must be at least 1 character long',
      }),
  
    hashtags: Joi.array()
      .items(
        Joi.string()
          .pattern(/^#[A-Za-z0-9_]+$/)
          .messages({
            'string.pattern.base': 'Each hashtag must start with "#" and contain only letters, numbers, or underscores',
          })
      )
      .messages({
        'array.base': 'Hashtags must be an array of strings',
      }),
  })
    .min(1)
    .messages({
      'object.min': 'At least one of "content" or "hashtags" must be provided',
      
});
  
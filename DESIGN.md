# DESIGN.md

## Database Schema Design

This document describes the database schema and relationships for the backend application using TypeORM.

---

### Users

- **Table:** `users`
- **Columns:**
  - `id`: Primary key
  - `firstName`: String
  - `lastName`: String
  - `email`: String (unique)
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

- **Relationships:**
  - One-to-Many with `Post` (a user can create many posts)
  - Many-to-Many with `Users` for followers/followings (via `follow` join table)
  - One-to-Many with `Like` (a user can like many posts)
  - One-to-Many with `Activity` (a user can have many activities)

---

### Post

- **Table:** `post`
- **Columns:**
  - `id`: Primary key
  - `authorId`: Foreign key to `Users`
  - `content`: Text
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

- **Relationships:**
  - Many-to-One with `Users` (each post has one author)
  - Many-to-Many with `Hashtag` (posts can have multiple hashtags via `post_hashtag` join table)
  - One-to-Many with `Like` (a post can have many likes)

---

### Like

- **Table:** `like`
- **Columns:**
  - `userId`: Primary key, foreign key to `Users`
  - `postId`: Primary key, foreign key to `Post`
  - `createdAt`: Timestamp

- **Relationships:**
  - Many-to-One with `Users`
  - Many-to-One with `Post`

---

### Hashtag

- **Table:** `hashtag`
- **Columns:**
  - `id`: Primary key
  - `tag`: String (unique)

- **Relationships:**
  - Many-to-Many with `Post` (hashtags can be attached to many posts)

---

### Activity

- **Table:** `activity`
- **Columns:**
  - `id`: Primary key
  - `userId`: Foreign key to `Users`
  - `type`: Enum (`POST_CREATED`, `LIKED`, `FOLLOWED`, `UNFOLLOWED`)
  - `referenceId`: Integer (could be a `postId`, `userId`, etc.)
  - `createdAt`: Timestamp

- **Relationships:**
  - Many-to-One with `Users`
  - Many-to-One with `Post` (nullable, only used when `type` is `POST_CREATED`)

---

## Entity Relationship Diagram (Simplified)


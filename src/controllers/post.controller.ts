import { Router } from "express";
import { getRepository, In } from "typeorm";
import { Post } from "../entities/Post";
import { validateAuth } from "../middleware/authentication.middleware";

const router = Router();

// GET /api/posts/feed?take=10&skip=0
router.get("/feed", validateAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const take = Number(req.query.take ?? 10);
  const skip = Number(req.query.skip ?? 0);
  const followingIds = req.user.followings.map(u => u.id);

  const postRepo = getRepository(Post);
  const posts = await postRepo.find({
    where: { author: In(followingIds) },
    order: { createdAt: "DESC" },
    take,
    skip
  });
  res.json(posts);
});


export default router;

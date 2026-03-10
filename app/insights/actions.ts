"use server";

import { blogPrisma } from "../../lib/db";

export async function getPublishedPosts() {
  return blogPrisma.post.findMany({
    where: { published: true },
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return blogPrisma.post.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      author: true,
    },
  });
}

export async function getRecentPosts(limit = 3) {
  return blogPrisma.post.findMany({
    where: { published: true },
    take: limit,
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

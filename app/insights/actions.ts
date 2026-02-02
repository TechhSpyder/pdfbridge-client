"use server";

import { prisma } from "../../lib/prisma";

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      author: true,
    },
  });
}

export async function getRecentPosts(limit = 3) {
  return prisma.post.findMany({
    where: { published: true },
    take: limit,
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

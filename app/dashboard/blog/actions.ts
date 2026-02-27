"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // For PDFBRIDGE, we'll check for the 'platform-owner' role in publicMetadata
    // We check both 'role' and 'userRole' keys to be flexible with Clerk metadata entry
    const userRole =
      (user.publicMetadata?.role as string) ||
      (user.publicMetadata?.userRole as string) ||
      "";
    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress || "";

    const allowedEmails = process.env.ADMIN_EMAILS?.toLowerCase().split(
      ",",
    ) || ["admin@techhspyder.com", "bellofrancis87@gmail.com"];
    const isAllowed =
      allowedEmails.includes(primaryEmail.toLowerCase()) ||
      userRole === "platform-owner";

    if (!isAllowed) {
      throw new Error(
        "Forbidden: You do not have platform-owner privileges for PDFBridge Journal.",
      );
    }

    return { userId, primaryEmail };
  } catch (error) {
    console.error("[verifyAdmin] Error:", error);
    throw error;
  }
}

// --- Posts ---

export async function getPosts() {
  await verifyAdmin();
  return prisma.post.findMany({
    include: {
      category: true,
      author: true,
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostById(id: string) {
  await verifyAdmin();
  return prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      author: true,
    },
  });
}

export async function upsertPost(data: {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  description?: string;
  tags?: string[];
  coverImage?: string;
  published: boolean;
  categoryId?: string;
  authorId?: string;
}) {
  await verifyAdmin();

  const postData = {
    title: data.title,
    slug: data.slug
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, ""),
    content: data.content,
    excerpt: data.excerpt,
    description: data.description,
    tags: data.tags || [],
    coverImage: data.coverImage,
    published: data.published,
    categoryId: data.categoryId || undefined,
    authorId: data.authorId || undefined,
  };

  if (data.id) {
    await prisma.post.update({
      where: { id: data.id },
      data: postData,
    });
  } else {
    await prisma.post.create({
      data: postData,
    });
  }

  revalidatePath("/dashboard/blog");
}

export async function deletePost(id: string) {
  await verifyAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/dashboard/blog");
}

// --- Categories ---

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCategory(name: string) {
  await verifyAdmin();
  const slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  return prisma.category.create({
    data: { name, slug },
  });
}

// --- Authors ---

export async function getAuthors() {
  return prisma.author.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createAuthor(data: {
  name: string;
  avatar?: string;
  bio?: string;
}) {
  await verifyAdmin();
  return prisma.author.create({
    data,
  });
}

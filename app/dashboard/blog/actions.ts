"use server";

import { getServerSession } from "@/lib/auth";
import { blogPrisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  try {
    const session = await getServerSession();

    if (!session) throw new Error("Unauthorized");

    const user = session.user as { id: string; email: string; role?: string };
    
    // Check for "platform-owner" role in our own database
    const userRole = user.role || "";
    const primaryEmail = user.email;

    const allowedEmails = process.env.ADMIN_EMAILS?.toLowerCase().split(",") || 
      ["admin@techhspyder.com", "bellofrancis87@gmail.com"];
    
    const isAllowed =
      allowedEmails.includes(primaryEmail.toLowerCase()) ||
      userRole === "platform-owner";

    if (!isAllowed) {
      throw new Error(
        "Forbidden: You do not have platform-owner privileges for PDFBridge Journal.",
      );
    }

    return { userId: user.id, primaryEmail };
  } catch (error) {
    console.error("[verifyAdmin] Error:", error);
    throw error;
  }
}

// --- Posts ---

export async function getPosts() {
  await verifyAdmin();
  return blogPrisma.post.findMany({
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
  return blogPrisma.post.findUnique({
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
    await blogPrisma.post.update({
      where: { id: data.id },
      data: postData,
    });
  } else {
    await blogPrisma.post.create({
      data: postData,
    });
  }

  revalidatePath("/dashboard/blog");
}

export async function deletePost(id: string) {
  await verifyAdmin();
  await blogPrisma.post.delete({ where: { id } });
  revalidatePath("/dashboard/blog");
}

// --- Categories ---

export async function getCategories() {
  return blogPrisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCategory(name: string) {
  await verifyAdmin();
  const slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  return blogPrisma.category.create({
    data: { name, slug },
  });
}

// --- Authors ---

export async function getAuthors() {
  return blogPrisma.author.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createAuthor(data: {
  name: string;
  avatar?: string;
  bio?: string;
}) {
  await verifyAdmin();
  return blogPrisma.author.create({
    data,
  });
}

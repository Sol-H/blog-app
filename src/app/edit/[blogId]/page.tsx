"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { getBlog, updateBlog } from '../../../lib/handleRequest';

export default function EditBlogPage({ params }: { params: { blogId: string } }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchBlog() {
      if (status === "loading") return;

      if (!session) {
        setError("You must be signed in to edit a blog.");
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching blog with ID:', params.blogId);
        const blogData = await getBlog(params.blogId);
        console.log('Received blog data:', blogData);

        if (!blogData) {
          setError("Blog not found");
          setIsLoading(false);
          return;
        }

        if (blogData.userEmail !== session.user?.email) {
          console.log('User email:', session.user?.email);
          console.log('Blog user email:', blogData.userEmail);
          setError("You don't have permission to edit this blog.");
          setIsLoading(false);
          return;
        }

        setTitle(blogData.blogTitle);
        setContent(blogData.content);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError("An error occurred while fetching the blog.");
        setIsLoading(false);
      }
    }

    fetchBlog();
  }, [params.blogId, session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateBlog(params.blogId, content, title);
    if (success) {
      router.push(`/blog/${params.blogId}`);
    } else {
      alert('Failed to update blog. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="container mx-auto mt-8 px-4">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: "Loading..." }} />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <div className="container mx-auto mt-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-64 dark:bg-slate-800 dark:border-slate-600"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
}

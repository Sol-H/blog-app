"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { getBlog, updateBlog } from '../../../lib/handleRequest';
import { marked } from 'marked';

export default function EditBlogPage({ params }: { params: { blogId: string } }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState('');
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
        const blogData = await getBlog(params.blogId);

        if (!blogData) {
          setError("Blog not found");
          setIsLoading(false);
          return;
        }

        if (blogData.userEmail !== session.user?.email) {
          setError("You don't have permission to edit this blog.");
          setIsLoading(false);
          return;
        }

        setTitle(blogData.blogTitle);
        const contentWithoutTitle = blogData.content.split('\n').slice(2).join('\n');
        setContent(contentWithoutTitle);
        setIsLoading(false);
      } catch (error) {
        setError("An error occurred while fetching the blog.");
        setIsLoading(false);
      }
    }

    fetchBlog();
  }, [params.blogId, session, status]);

  useEffect(() => {
    const updatePreview = async () => {
      const formattedContent = `# ${title}\n\n${content}`;
      const renderedContent = await marked(formattedContent);
      setPreview(renderedContent);
    };
    updatePreview();
  }, [title, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formattedContent = `# ${title}\n\n${content}`;

    const success = await updateBlog(params.blogId, formattedContent, title);
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
        <div className="flex gap-4">
          <form onSubmit={handleSubmit} className="flex-1">
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
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = e.currentTarget.selectionStart;
                    const end = e.currentTarget.selectionEnd;
                    const newValue = content.substring(0, start) + '\t' + content.substring(end);
                    setContent(newValue);
                  }
                }}
                className="w-full p-2 border rounded h-64 dark:bg-slate-800 dark:border-slate-600"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Update Blog
            </button>
          </form>
          <div className="flex-1">
            <h2 className="mb-2">Preview</h2>
            <div 
              className="prose dark:prose-invert max-w-none p-4 border rounded min-h-full dark:bg-slate-800 dark:border-slate-600"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

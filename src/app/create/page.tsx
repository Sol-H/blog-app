"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { createBlog } from '../../lib/handleRequest';
import LoginButton from "@/components/loginButton";
import { marked } from 'marked';
import { configureMarked } from '../../lib/markdownConfig';

function SignInMessage() {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <p className="text-xl mb-4">Please sign in to create a blog.</p>
      <LoginButton />
    </div>
  );
}

export default function CreateBlogPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const updatePreview = async () => {
      configureMarked();
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

    try {
      const blogId = await createBlog(formattedContent, title);
      if (blogId) {
        router.push(`/blog/${blogId}`);
      } else {
        setError("Failed to create blog.");
      }
    } catch (err) {
      setError("An error occurred while creating the blog.");
    }
    setIsLoading(false);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <SignInMessage />;
  }

  return (
    <div className="flex flex-col">
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Create a New Blog</h1>
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
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Blog'}
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
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

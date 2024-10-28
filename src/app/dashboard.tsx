"use client";
import { useSession } from "next-auth/react"
import { MdAddBox } from "react-icons/md";
import { deleteBlog, getBlogs } from "../lib/handleRequest";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';

function CreateBlogPanel () {
  const router = useRouter();
  return (
    <div 
      className="flex items-center justify-center m-auto p-4 hover:cursor-pointer rounded-md content-center dark:bg-green-900 dark:hover:bg-green-800 bg-green-700 hover:bg-green-800 text-white"
      onClick={() => router.push('/create')}
    >
      <MdAddBox className="text-6xl" />
      <p className="text-2xl m-1">Create a blog</p>
    </div>
  )
}

interface Blog {
  blogTitle: string;
  blogDescription: string;
  date: string;
  blogLocationId: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[] | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      const blogsData = session ? await getBlogs(session): null;
      if (typeof blogsData !== 'undefined') {
        setBlogs(blogsData);
      }
    }
    fetchBlogs();
  }, [session]);

  const handleDeleteBlog = async (blogLocationId: string) => {
    const success = await deleteBlog(blogLocationId);
    if (success) {
      setBlogs((prevBlogs) => prevBlogs ? prevBlogs.filter(blog => blog.blogLocationId.toString() !== blogLocationId) : null);
    } else {
      alert('Failed to delete blog. Please try again.');
    }
  };

  if (session) {
    const username = session.user?.username || '';
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl text-center mt-6 mb-10">Your Blogs</h1>
        <Link href={`/user/${username}`} className="text-center mb-4 text-blue-500 hover:text-blue-700">
          View Public Page
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <CreateBlogPanel />
          {blogs && [...blogs].reverse().map((blog, index) => (
            <BlogCard 
              key={index} 
              title={blog.blogTitle} 
              content={blog.blogDescription} 
              date={blog.date} 
              blogLocationId={blog.blogLocationId.toString()} 
              onDelete={handleDeleteBlog}
            />
          ))}
        </div>
      </div>
    );
  }
  return <></>;
}

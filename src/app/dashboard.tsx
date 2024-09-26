"use client";
import { useSession } from "next-auth/react"
import { MdAddBox, MdEdit } from "react-icons/md";
import { getBlogs, getBlog } from "./handleRequest";
import React, { useEffect, useState } from 'react';


function BlogPanel ( {title, content , date, blogLocationId}: {title: string, content: string, date: string, blogLocationId: string} ) {
  date = new Date(date).toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="flex flex-col m-4 p-4 rounded-md content-between hover:cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-400 hover:bg-slate-500" onClick={() => handleBlogClick(blogLocationId)}>
        <h2 className="text-2xl m-1">{title}</h2>
          <button className="text-gray-500 hover:text-gray-700 mb-auto absolute">
            <MdEdit />
            <span className="sr-only">Edit</span>
          </button>
      <p className="m-1">{content}</p>
      <p className="m-1 text-sm dark:text-gray-500 text-gray-700 mt-auto">{date}</p>
    </div>
  )
}

async function handleBlogClick (blogLocationId: string) {
  console.log(`Clicked on blog ${blogLocationId}`);
  const blog = await getBlog(blogLocationId.toString());
  console.log(blog);
}

function CreateBlogPanel () {
  return (
    <div className="flex items-center justify-center m-auto p-4 hover:cursor-pointer rounded-md content-center dark:bg-green-900 dark:hover:bg-green-800 bg-green-700 hover:bg-green-800 text-white">
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

  useEffect(() => {
    console.log(blogs);
  }, [blogs]);

  if (session) {
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl text-center mt-6 mb-10">{session.user?.name?.split(' ')[0]}&apos;s Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <CreateBlogPanel />
          {blogs && [...blogs].reverse().map((blog, index) => (
            <BlogPanel key={index} title={blog.blogTitle} content={blog.blogDescription} date={blog.date} blogLocationId={blog.blogLocationId.toString()} />
          ))}
        </div>
      </div>
    );
  }
  return <></>;
}
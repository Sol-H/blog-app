'use client';

import { useState, useEffect } from 'react';
import { getBlogsByUsername } from '@/app/handleRequest';
import BlogPanel from '@/components/BlogPanel';

// Define the shape of a blog object
interface Blog {
  blogTitle: string;
  blogDescription: string;
  date: string;
  blogLocationId: number;
}

export default function UserPublicPage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        // The username in the URL might not have spaces, but the one in the database might
        // So we need to fetch blogs for both possibilities
        const fetchedBlogs = await getBlogsByUsername(username);
        console.log(fetchedBlogs);
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    }
    fetchBlogs();
  }, [username]);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-center mt-6 mb-10">{username}&apos;s Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogs && [...blogs].reverse().map((blog, index) => (
          <BlogPanel 
            key={index} 
            title={blog.blogTitle} 
            content={blog.blogDescription} 
            date={blog.date} 
            blogLocationId={blog.blogLocationId.toString()} 
            showDeleteButton={false}
            showEditButton={false}
          />
        ))}
      </div>
    </div>
  );
}

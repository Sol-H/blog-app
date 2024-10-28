import axios from "axios";
import type { Session } from "next-auth";

// Add this interface at the top of the file or in a separate types file
interface User {
  _id: { toString(): string };
  username: string;
  name: string;
  email: string;
}

export async function getBlogs(session: Session) {
  if (session) {
    try {
      const response = await axios.get('/api/blogs');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error in getBlogs: ', error.message);
        if (error.response?.status === 405) {
          console.error('Method Not Allowed: Please check the HTTP method used.');
        }
      } else {
        console.error('Unexpected error in getBlogs: ', error);
      }
      return [];
    }
  }
  return [];
}

export async function getBlog(blogId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    const response = await axios.get(`${baseUrl}/api/s3blogs/${blogId}`);

    if (response.data && response.data.content) {
      return {
        content: response.data.content,
        userEmail: response.data.userEmail,
        blogTitle: response.data.blogTitle
      };
    } else {
      throw new Error('Invalid blog data received');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error in getBlog: ${error.message}`);
      console.error('Full error object:', error);
    } else {
      console.error('Unexpected error in getBlog:', error);
    }
    return null;
  }
}

export async function createBlog(content: string, title: string) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/s3blogs`, { content, title });
    return response.data.blogId;
  } catch (error) {
    console.error('Error in createBlog: ', error);
    return null;
  }
}

export async function updateBlog(blogId: string, content: string, title: string) {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/s3blogs/${blogId}`, { content, title });
    return response.status === 200;
  } catch (error) {
    console.error('Error in updateBlog: ', error);
    return false;
  }
}

export async function getBlogsByUsername(username: string) {
  try {
    const response = await fetch(`/api/blogs/${username}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs by username:', error);
    throw error;
  }
}

export async function deleteBlog(blogId: string) {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/s3blogs/${blogId}`);
    return response.status === 200;
  } catch (error) {
    console.error('Error in deleteBlog: ', error);
    return false;
  }
}

export async function getUsers() {
  try {
    const response = await axios.get<User[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
    return response.data.map((user) => ({
      _id: user._id.toString(),
      username: user.username,
      name: user.name,
      email: user.email
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

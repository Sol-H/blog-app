import axios from "axios";
import type { Session } from "next-auth";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getBlogs(session: Session) {
  if (!session) return [];
  
  try {
    const response = await api.get('/api/blogs');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error in getBlogs:', error.message);
      if (error.response?.status === 405) {
        console.error('Method Not Allowed: Please check the HTTP method used.');
      }
    } else {
      console.error('Unexpected error in getBlogs:', error);
    }
    return [];
  }
}

export async function getBlog(blogId: string) {
  try {
    const response = await api.get(`/api/s3blogs/${blogId}`);
    
    if (response.data && response.data.content) {
      return {
        content: response.data.content,
        userEmail: response.data.userEmail,
        blogTitle: response.data.blogTitle
      };
    }
    throw new Error('Invalid blog data received');
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
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching users:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    return [];
  }
}

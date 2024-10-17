import axios from "axios";
import type { Session } from "next-auth";

export async function getBlogs(session: Session) {
  if (session) {
    try {
      const response = await axios.get('/api/blogs');
      console.log(`returning data: ${response.data.length} blogs`);
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
  console.log(`Fetching blog with id: ${blogId}`);
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    const response = await axios.get(`${baseUrl}/api/s3blogs/${blogId}`, {
      withCredentials: true,
    });

    console.log('API response:', response.data);
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
      if (error.response?.status === 401) {
        console.error('Unauthorized: Access token might be invalid or expired.');
      } else {
        console.error(`Error in getBlog: ${error.message}`);
      }
      console.error('Full error object:', error);
    } else {
      console.error('Unexpected error in getBlog:', error);
    }
    return null;
  }
}

export async function createBlog(content: string, title: string) {
  console.log(`Creating blog with title: ${title}`);
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/s3blogs`, { content, title });
    return response.data.blogId;
  } catch (error) {
    console.error('Error in createBlog: ', error);
    return null;
  }
}

export async function updateBlog(blogId: string, content: string, title: string) {
  console.log(`Updating blog with id: ${blogId}`);
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/s3blogs/${blogId}`, { content, title });
    return response.status === 200;
  } catch (error) {
    console.error('Error in updateBlog: ', error);
    return false;
  }
}

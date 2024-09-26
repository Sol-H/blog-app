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
    const response = await axios.get(`/api/s3blogs/${blogId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error in getBlog: ', error.message);
      if (error.response?.status === 404) {
        console.error('Blog not found');
      }
    } else {
      console.error('Unexpected error in getBlog: ', error);
    }
    return null;
  }
}
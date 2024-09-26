import client from './db';

export const getBlogs = async (userEmail: string) => {
  try {
    if (userEmail === '') {
      throw new Error('User not authenticated');
    }
    const blogs = await client.db().collection('blogs').find({ userEmail }).toArray();
    return blogs;
  } catch (error) {
    console.error('Error in getBlogs: ', error);
    return [];
  }
};


const dbFunctions = {
  getBlogs,
};

export default dbFunctions;
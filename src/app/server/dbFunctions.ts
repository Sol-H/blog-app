import db from './db';  // Adjust this import if necessary

export async function getBlogs() {
  try {
    const client = await db;  // Use connect() instead of db()
    const database = client.db();  // Get the database instance
    const blogsCollection = database.collection('blogs');
    
    const blogs = await blogsCollection.find({}).toArray();
    return blogs;
  } catch (error) {
    console.error('Error in getBlogs:', error);
    throw error;
  }
}

// ... rest of the file
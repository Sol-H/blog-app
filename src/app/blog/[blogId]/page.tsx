'use client';

import { getBlog } from '../../handleRequest';
import { marked } from 'marked';
import Navbar from '../../navbar';

export default async function BlogPage({ params }: { params: { blogId: string } }) {
  console.log('BlogPage rendered with blogId:', params.blogId);
  try {
    const blogContent = await getBlog(params.blogId);
    console.log('Blog content received:', blogContent ? 'Yes' : 'No');
    
    if (!blogContent) {
      throw new Error('Blog content not found');
    }

    const htmlContent = marked(blogContent.content);

    return (
      <div className="flex flex-col">
        <Navbar />
        <div className="container mx-auto mt-8 px-4">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering blog page:', error);
    return (
      <div className="flex flex-col">
        <Navbar />
        <div className="container mx-auto mt-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>Sorry, we couldn&apos;t load the blog post. Please try again later.</p>
        </div>
      </div>
    );
  }
}
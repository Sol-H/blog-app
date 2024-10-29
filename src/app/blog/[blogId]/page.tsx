import { getBlog } from '../../../lib/handleRequest';
import { marked } from 'marked';
import { configureMarked } from '@/lib/markdownConfig';

export default async function BlogPage({ params }: { params: { blogId: string } }) {
  try {
    const blogContent = await getBlog(params.blogId);

    if (!blogContent) {
      throw new Error('Blog content not found');
    }

    configureMarked();
    const htmlContent = marked(blogContent.content);

    return (
      <div className="flex flex-col">
        <div className="container mx-auto mt-8 px-4">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col">
        <div className="container mx-auto mt-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>Sorry, we couldn&apos;t load the blog post. Please try again later.</p>
        </div>
      </div>
    );
  }
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
//import { useRouter } from 'next/navigation';
import BlogCard from '@/components/BlogCard';

interface SearchResult {
  blogTitle: string;
  blogDescription: string;
  date: string;
  blogLocationId: string;
  username: string;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('q') || '';
  
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Perform initial search if URL has a query parameter
  useEffect(() => {
    if (initialSearchTerm) {
      handleSearch(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const handleSearch = async (term: string = inputValue) => {
    if (!term.trim()) return;

    setSearchTerm(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Search Blogs</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for blogs..."
            className="flex-1 p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
          />
          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <div key={index} className="flex flex-col">
                <BlogCard
                  title={result.blogTitle}
                  content={result.blogDescription}
                  date={result.date}
                  blogLocationId={result.blogLocationId}
                  showDeleteButton={false}
                  showEditButton={false}
                />
                <a
                  href={`/user/${result.username}`}
                  className="text-blue-500 hover:text-blue-700 text-center mt-2"
                >
                  by {result.username}
                </a>
              </div>
            ))}
          </div>
        ) : searchTerm !== '' ? (
          <p className="text-center text-gray-500">No results found</p>
        ) : null}
      </div>
    </div>
  );
}

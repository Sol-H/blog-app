import React from 'react';
import { MdEdit, MdDelete } from "react-icons/md";

interface BlogCardProps {
  title: string;
  content: string;
  date: string;
  blogLocationId: string;
  showEditButton?: boolean;
  onDelete?: (blogLocationId: string) => void;
  showDeleteButton?: boolean;
}

export default function BlogCard({ title, content, date, blogLocationId, showEditButton = true, onDelete, showDeleteButton = true }: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/edit/${blogLocationId}`;
  };

  const handleBlogClick = () => {
    window.location.href = `/blog/${blogLocationId}`;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this blog?')) {
      onDelete?.(blogLocationId);
    }
  };

  return (
    <div className="flex flex-col m-4 p-4 rounded-md hover:cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-400 hover:bg-slate-500" onClick={handleBlogClick}>
      <div className="flex flex-col mb-2">
        <div className="flex justify-between">
          {showEditButton && (
            <button 
              className="text-gray-500 hover:text-gray-400 mr-2 p-1"
              onClick={handleEditClick}
            >
              <MdEdit size={20} />
              <span className="sr-only">Edit</span>
            </button>
          )}
          {showDeleteButton && (
            <button 
              className="text-red-500 hover:text-red-700 p-1"
              onClick={handleDeleteClick}
            >
              <MdDelete size={20} />
              <span className="sr-only">Delete</span>
            </button>
          )}
          
        </div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      </div>
      <p className="mb-4">{content}</p>
      <p className="text-sm dark:text-gray-400 text-gray-600">{formattedDate}</p>
    </div>
  );
}

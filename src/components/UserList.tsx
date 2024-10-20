'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUsers } from '@/app/handleRequest';

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Users to check out</h2>
      <ul className="space-y-2 flex flex-col gap-2 justify-center items-center">
        {users.map((user) => (
          <li key={user._id} className="w-fit bg-slate-200 dark:bg-slate-700 p-3 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            <Link href={`/user/${encodeURIComponent(user.username)}`}>
              <span className="text-blue-600 dark:text-blue-400 hover:underline">{user.username}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

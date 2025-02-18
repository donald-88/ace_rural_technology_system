"use client"

import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { User } from 'better-auth'
import { authClient } from '@/lib/auth-client'

export default function Page() {

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        const response = await authClient.admin.listUsers({
          query: { limit: 10 },
        });
        if (response?.data) {
          setUsers(response.data.users as User[]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch users")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <DataTable columns={columns} data={users} />
    </div>
  )
}
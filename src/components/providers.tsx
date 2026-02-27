"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore, type MockUser } from "@/lib/stores/auth.store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        retry: 1,
      },
    },
  }));

  const { setMockUsers, setCurrentUser, currentUser } = useAuthStore();

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/user");
        const users = await res.json();
        const mockUsers: MockUser[] = users.map((u: { id: string; name: string; type: string; companyId?: string; company?: { name: string } }) => ({
          id: u.id,
          name: u.name,
          type: u.type as "JOBSEEKER" | "EMPLOYER",
          companyId: u.companyId,
          companyName: u.company?.name,
        }));
        setMockUsers(mockUsers);
        if (!currentUser && mockUsers.length > 0) {
          setCurrentUser(mockUsers[0]);
        }
      } catch {
        // API not ready yet
      }
    }
    loadUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

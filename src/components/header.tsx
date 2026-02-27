"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Header() {
  const { currentUser, mockUsers, setCurrentUser } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href={currentUser?.type === "EMPLOYER" ? "/company" : "/"} className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">GENKO</span>
          <span className="text-xs text-gray-500">ゲンコ</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="max-w-[120px] truncate">{currentUser?.name ?? "ユーザー選択"}</span>
              {currentUser && (
                <Badge variant={currentUser.type === "EMPLOYER" ? "default" : "secondary"} className="text-xs">
                  {currentUser.type === "EMPLOYER" ? "企業" : "求職者"}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ユーザー切替</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockUsers.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className={currentUser?.id === user.id ? "bg-blue-50" : ""}
              >
                <span className="mr-2">{user.name}</span>
                <Badge variant={user.type === "EMPLOYER" ? "default" : "secondary"} className="text-xs">
                  {user.type === "EMPLOYER" ? "企業" : "求職者"}
                </Badge>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

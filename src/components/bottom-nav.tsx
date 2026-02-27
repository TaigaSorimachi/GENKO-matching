"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, FileText, MessageCircle, User } from "lucide-react";

const navItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/jobs", label: "求人検索", icon: Search },
  { href: "/applications", label: "応募", icon: FileText },
  { href: "/messages", label: "チャット", icon: MessageCircle },
  { href: "/profile", label: "プロフィール", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

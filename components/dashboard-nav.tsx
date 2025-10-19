"use client"

import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"
import Link from "next/link"
import { Icons } from "./icons"
import { SidebarNavItem } from "@/config/dashboard"
import { UserDropdown } from "./user-dropdown"

interface DashboardNavProps {
  items?: SidebarNavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <div className="pt-6 pb-2 flex flex-col h-full border-r">
      <nav className="grid items-start gap-2">
        {items.map((item, index) => {
          const Icon = Icons[item.icon as keyof typeof Icons || "arrowRight"]
          return (
            item.href && (
              <Link key={index} href={item.disabled ? "/" : item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md pl-3 mx-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          )
        })}
      </nav>
      <div className="mb-4 mt-auto">
        <UserDropdown />
      </div>
    </div>
  )
}
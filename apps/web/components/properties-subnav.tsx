"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLink {
  label: string
  href: string
}

export function PropertiesSubnav() {
  const pathname = usePathname()
  const split = pathname.split("/")
  const propertyId = split[2]

  const navLinks: NavLink[] = [
    { label: "Details", href: `/properties/${propertyId}` },
    { label: "Calendar", href: `/properties/${propertyId}/calendar` },
    { label: "Links", href: `/properties/${propertyId}/links` },
  ]

  return (
    <div className="mt-4 border-b">
      <nav className="-mb-px flex gap-6">
        {navLinks.map(({ label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "pb-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 
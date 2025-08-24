"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: "Properties", href: "/properties" },
]

export function PropertiesSubnav() {
  const pathname = usePathname()

  // Check if we're on a specific property page to show subnav
  const isPropertyPage = pathname.startsWith("/properties/") && pathname !== "/properties"
  const propertyId = isPropertyPage ? pathname.split("/")[2] : null

  return (
    <div className="mt-4 border-b">
      <nav className="-mb-px flex gap-6">
        {navLinks.map(({ label, href }) => {
          const isActive = pathname === href || (href === "/properties" && pathname.startsWith("/properties"))
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
        
        {isPropertyPage && propertyId && (
          <>
            <Link
              href={`/properties/${propertyId}`}
              aria-current={pathname === `/properties/${propertyId}` ? "page" : undefined}
              className={cn(
                "pb-2 text-sm font-medium transition-colors",
                pathname === `/properties/${propertyId}`
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Details
            </Link>
            <Link
              href={`/properties/${propertyId}/links`}
              aria-current={pathname === `/properties/${propertyId}/links` ? "page" : undefined}
              className={cn(
                "pb-2 text-sm font-medium transition-colors",
                pathname === `/properties/${propertyId}/links`
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Links
            </Link>
          </>
        )}
      </nav>
    </div>
  )
} 
'use client'

import React from 'react'
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface HRPageHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export function HRPageHeader({ breadcrumbs, title, subtitle, action }: HRPageHeaderProps) {
  return (
    <div className="border-b bg-card px-4 md:px-8 py-4">
      <div className="flex flex-col gap-2 max-w-7xl mx-auto">
        <nav className="flex items-center text-xs text-muted-foreground gap-1.5">
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              {b.href && !b.isActive ? (
                <Link href={b.href} className="hover:text-foreground">
                  {b.label}
                </Link>
              ) : (
                <span className={b.isActive ? 'font-medium text-foreground' : ''}>{b.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        {title && (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

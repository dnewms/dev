'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mail, BarChart3, Archive, Users, Settings, FileText } from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Home', href: '/', icon: Mail },
  { name: 'Builder', href: '/builder', icon: FileText },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Archive', href: '/archive', icon: Archive },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-michigan-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-michigan-maize rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-michigan-blue" />
            </div>
            <div>
              <div className="font-bold text-lg">U-M Engineering</div>
              <div className="text-xs text-michigan-wave-blue">Newsletter Builder</div>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
                    isActive
                      ? 'bg-michigan-maize text-michigan-blue font-semibold'
                      : 'text-white hover:bg-white/10'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

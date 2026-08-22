'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Clock, 
  CreditCard,
  FileText,
  User
} from 'lucide-react'

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/admin/employees', icon: Users },
  { name: 'Attendance', href: '/admin/attendance', icon: Clock },
  { name: 'Leave Requests', href: '/admin/leave', icon: CalendarDays },
  { name: 'Payroll', href: '/admin/payroll', icon: CreditCard },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
]

const employeeNav = [
  { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', href: '/employee/profile', icon: User },
  { name: 'My Attendance', href: '/employee/attendance', icon: Clock },
  { name: 'My Leave', href: '/employee/leave', icon: CalendarDays },
  { name: 'My Payroll', href: '/employee/payroll', icon: CreditCard },
]

export function Sidebar({ role }: { role: 'ADMIN' | 'EMPLOYEE' }) {
  const pathname = usePathname()
  const navigation = role === 'ADMIN' ? adminNav : employeeNav

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Dayflow
        </h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
              `}
            >
              <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

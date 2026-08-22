'use client'

import { logout } from '@/app/(auth)/actions'
import { LogOut, User as UserIcon, Search, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const adminNav = [
  { name: 'Employees', href: '/admin/employees' },
  { name: 'Attendance', href: '/admin/attendance' },
  { name: 'Time Off', href: '/admin/leave' },
  { name: 'Payroll', href: '/admin/payroll' },
  { name: 'Reports', href: '/admin/reports' },
]

const employeeNav = [
  { name: 'Employees', href: '/employee/employees' },
  { name: 'Attendance', href: '/employee/attendance' },
  { name: 'Time Off', href: '/employee/leave' },
]

export function Topbar({ userEmail, role }: { userEmail: string, role: string }) {
  const pathname = usePathname()
  const navigation = role === 'ADMIN' ? adminNav : employeeNav
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Status dot logic: bg-red-500 = default, bg-emerald-500 = checked in
  const [statusColor, setStatusColor] = useState('bg-red-500')

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownRef])

  const handleCheckIn = () => {
    setStatusColor('bg-emerald-500')
    setIsProfileOpen(false)
  }

  const handleCheckOut = () => {
    setStatusColor('bg-red-500')
    setIsProfileOpen(false)
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 shadow-sm">
      
      {/* Left side: Logo & Navigation */}
      <div className="flex items-center space-x-6 h-full">
        {/* Company Logo placeholder */}
        <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded px-3 py-1.5 shadow-sm">
          <span className="text-slate-700 font-semibold text-sm">App/Web Logo</span>
        </div>

        <nav className="hidden md:flex h-full">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 h-full text-sm font-medium transition-colors border-b-2
                  ${isActive 
                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' 
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* Right side: Search, Status, Profile */}
      <div className="flex items-center space-x-6 relative">
        {/* Search Bar */}
        <div className="hidden lg:flex relative items-center">
          <Search className="w-5 h-5 text-indigo-500 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all w-56 shadow-sm"
          />
        </div>

        {/* Status Dot */}
        <div className="flex items-center justify-center relative">
          <div className={`w-4 h-4 rounded-full ${statusColor} shadow-sm cursor-pointer transition-colors duration-300 relative z-10`} title="Status" />
          {/* Outer glowing ring for status */}
          <div className={`absolute inset-0 rounded-full ${statusColor} opacity-30 blur-sm w-4 h-4 animate-pulse`} />
        </div>
        
        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center overflow-hidden hover:ring-4 ring-indigo-500/20 hover:border-indigo-300 transition-all focus:outline-none shadow-sm"
          >
            <UserIcon className="w-5 h-5 text-indigo-600" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-600 font-medium truncate">{userEmail}</p>
              </div>
              
              <Link 
                href={role === 'ADMIN' ? '/admin/profile' : '/employee/profile'} 
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                My Profile
              </Link>
              
              {/* Check IN / Check OUT widget shown in dropdown as per wireframe notes */}
              <div className="px-3 py-2 border-y border-slate-100 bg-slate-50">
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">Attendance</p>
                <div className="flex flex-col gap-1.5">
                  <button 
                    onClick={handleCheckIn}
                    className="flex items-center justify-between px-4 py-3 text-base font-bold text-slate-700 bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-300 rounded-md transition-colors w-full shadow-sm"
                  >
                    <span>Check In</span>
                    <Clock className="w-5 h-5 text-emerald-500" />
                  </button>
                  <button 
                    onClick={handleCheckOut}
                    className="flex items-center justify-between px-4 py-3 text-base font-bold text-slate-700 bg-white hover:bg-rose-50 border-2 border-slate-200 hover:border-rose-300 rounded-md transition-colors w-full shadow-sm"
                  >
                    <span>Check Out</span>
                    <LogOut className="w-5 h-5 text-rose-500" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

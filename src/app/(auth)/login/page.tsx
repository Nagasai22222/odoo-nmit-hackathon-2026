'use client'

import { useActionState, useState } from 'react'
import { login } from '../actions'
import Link from 'next/link'
import { User, Shield } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)
  
  // Track selected tab
  const [roleMode, setRoleMode] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE')
  
  // Prefilled credentials for easy testing
  const [identifier, setIdentifier] = useState('EMP-001')
  const [password, setPassword] = useState('password123')

  const handleRoleChange = (role: 'EMPLOYEE' | 'ADMIN') => {
    setRoleMode(role)
    if (role === 'ADMIN') {
      setIdentifier('newadmin@dayflow.com')
      setPassword('admin123')
    } else {
      setIdentifier('EMP-001')
      setPassword('password123')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Placeholder */}
          <div className="flex items-center justify-center bg-slate-100 border border-slate-200 rounded px-8 py-3 mb-6 shadow-sm">
            <span className="text-slate-700 font-semibold tracking-wider">App/Web Logo</span>
          </div>

          {/* Quick Login Toggle */}
          <div className="flex w-full bg-slate-100 p-1 rounded-lg mb-6 border border-slate-200">
            <button
              onClick={() => handleRoleChange('EMPLOYEE')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-md transition-all ${
                roleMode === 'EMPLOYEE' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Employee Login
            </button>
            <button
              onClick={() => handleRoleChange('ADMIN')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-md transition-all ${
                roleMode === 'ADMIN' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Login
            </button>
          </div>

          <form action={formAction} className="w-full space-y-5">
            {state?.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {state.error}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Login Id/Email :-</label>
              <input 
                type="text" 
                name="identifier" 
                required 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Password :-</label>
              <input 
                type="password" 
                name="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
              />
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-[#c026d3] hover:bg-[#a21caf] text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center mt-8 tracking-wider"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-slate-600 text-sm font-medium">
            Don't have an Account?{' '}
            <Link href="/signup" className="text-purple-600 hover:text-purple-700 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

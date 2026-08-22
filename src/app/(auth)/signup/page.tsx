'use client'

import { useActionState, useEffect } from 'react'
import { signup } from '../actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Upload, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null)
  const router = useRouter()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (state?.success) {
      router.push('/login?registered=true')
    }
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Placeholder */}
          <div className="flex items-center justify-center bg-slate-100 border border-slate-200 rounded px-8 py-3 mb-8 shadow-sm">
            <span className="text-slate-700 font-semibold tracking-wider">App/Web Logo</span>
          </div>

          <form action={formAction} className="w-full space-y-4">
            {state?.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {state.error}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Company Name :-</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="companyName" 
                  required 
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
                />
                <input type="file" id="logo-upload" className="hidden" accept="image/*" />
                <button 
                  type="button" 
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg px-4 flex items-center justify-center transition-colors" 
                  title="Upload Logo"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Name :-</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Email :</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Phone :</label>
              <input 
                type="text" 
                name="phone" 
                required 
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex flex-col gap-1 relative">
              <label className="text-sm font-medium text-slate-700">Password :-</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password" 
                  required 
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1 relative">
              <label className="text-sm font-medium text-slate-700">Confirm Password :-</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword" 
                  required 
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm pr-10"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending || state?.success}
              className="w-full bg-[#c026d3] hover:bg-[#a21caf] text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center mt-6 tracking-wider"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-slate-600 text-sm font-medium">
            Already have an account ?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

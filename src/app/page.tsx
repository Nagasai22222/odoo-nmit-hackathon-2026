import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const session = await getSession()
  if (session) {
    if (session.role === 'ADMIN') redirect('/admin/dashboard')
    else redirect('/employee/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Welcome to Dayflow HRMS
        </h1>
        <p className="text-xl text-slate-400">
          The modern, intuitive human resource management system built for the future of work.
        </p>
        <div className="flex gap-4 justify-center pt-8">
          <Link href="/login" className="px-8 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors backdrop-blur-sm">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

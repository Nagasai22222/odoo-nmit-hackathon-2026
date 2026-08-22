import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  // If it's a dummy ID, just render the profile form with placeholder data
  if (params.id.startsWith('dummy-')) {
    const dummyUser = {
      id: params.id,
      name: `Employee ${params.id.replace('dummy-', '')}`,
      email: `employee${params.id.replace('dummy-', '')}@company.com`,
      employeeId: `EMP-${params.id.replace('dummy-', '').padStart(3, '0')}`,
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/employee/employees" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Employee Details</h2>
        </div>
        <ProfileForm user={dummyUser} role="EMPLOYEE" />
      </div>
    )
  }

  // Otherwise, fetch from DB
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { user: true }
  })

  if (!employee) {
    notFound()
  }

  const userData = {
    ...employee.user,
    employeeId: employee.employeeId,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/employee/employees" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Employee Details</h2>
      </div>
      <ProfileForm user={userData} role="EMPLOYEE" />
    </div>
  )
}

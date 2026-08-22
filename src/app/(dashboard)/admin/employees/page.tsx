import { prisma } from '@/lib/prisma'
import { User as UserIcon, Plane } from 'lucide-react'
import Link from 'next/link'

export default async function AdminEmployees() {
  const employees = await prisma.employee.findMany({
    include: { user: true }
  })

  // Pad with dummy data if there are fewer than 12 employees to fill the screen nicely
  const displayEmployees = [...employees]
  if (displayEmployees.length < 12) {
    const currentLength = displayEmployees.length
    const dummyCount = 12 - currentLength
    for (let i = 0; i < dummyCount; i++) {
      displayEmployees.push({
        id: `dummy-${currentLength + i}`,
        firstName: 'Dummy',
        lastName: `Employee ${currentLength + i + 1}`,
        employeeId: `EMP-${(currentLength + i + 1).toString().padStart(3, '0')}`,
        status: i % 3 === 0 ? 'PRESENT' : i % 3 === 1 ? 'ABSENT' : 'LEAVE'
      } as any)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Employee Directory</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayEmployees.map((emp: any) => {
          const isPresent = emp.status === 'PRESENT'
          const isLeave = emp.status === 'LEAVE'
          const isAbsent = emp.status === 'ABSENT' || !emp.status
          
          return (
            <Link 
              href={`/admin/employees/${emp.id}`}
              key={emp.id} 
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group relative block"
            >
              <div className="absolute top-4 right-4 flex items-center justify-center">
                {isPresent && <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" title="Present" />}
                {isAbsent && <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" title="Absent" />}
                {isLeave && <div title="On Leave"><Plane className="w-4 h-4 text-indigo-500 rotate-45" /></div>}
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                  <UserIcon className="w-10 h-10 text-slate-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {emp.employeeId || 'ID Not Set'}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
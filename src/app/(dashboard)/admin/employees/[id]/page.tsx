import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { redirect } from 'next/navigation'

export default async function EmployeeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  const { id } = await params

  let user = null
  
  if (id.startsWith('dummy-')) {
    // Handle dummy employee clicks
    const dummyIndex = id.split('-')[1]
    user = {
      name: `Employee Name ${parseInt(dummyIndex) + 1}`,
      email: `employee${dummyIndex}@dayflow.com`,
      phone: '+1 234 567 890',
      companyName: 'Dayflow Inc.',
      employeeId: `EMP-${dummyIndex.padStart(3, '0')}`,
    }
  } else {
    // Fetch from database
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { user: true }
    })
    
    if (!employee) {
      return <div className="p-6 text-slate-500">Employee not found.</div>
    }
    
    user = {
      name: employee.user?.name || `${employee.firstName} ${employee.lastName}`,
      email: employee.user?.email,
      phone: employee.phone || employee.user?.phone,
      companyName: employee.user?.companyName,
      employeeId: employee.employeeId,
    }
  }

  return (
    <div className="pb-12">
      <ProfileForm user={user} role="ADMIN" />
    </div>
  )
}
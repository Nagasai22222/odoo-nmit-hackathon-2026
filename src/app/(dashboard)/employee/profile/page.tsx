import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function EmployeeProfilePage() {
  const session = await getSession()
  
  if (!session) return null

  // Fetch full user data including employee relation if it exists
  const user = await prisma.user.findUnique({
    where: { email: session.email },
    include: { employee: true }
  })

  // Normalize data for the form
  const profileData = {
    name: user?.name || user?.employee?.firstName + ' ' + user?.employee?.lastName,
    email: user?.email,
    phone: user?.phone || user?.employee?.phone,
    companyName: user?.companyName,
    employeeId: user?.employee?.employeeId,
  }

  return (
    <div className="pb-12">
      <ProfileForm user={profileData} role="EMPLOYEE" />
    </div>
  )
}
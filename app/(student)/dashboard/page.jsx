import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StudentDashboard from './StudentDashboard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  return <StudentDashboard user={session?.user} />
}

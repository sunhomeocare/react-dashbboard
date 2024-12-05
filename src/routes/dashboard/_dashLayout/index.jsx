import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/components/Dashboard/dashboardPage/dashboard'

export const Route = createFileRoute('/dashboard/_dashLayout/')({
  component: Dashboard
})

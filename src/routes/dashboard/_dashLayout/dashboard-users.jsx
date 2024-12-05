import { createFileRoute } from '@tanstack/react-router';
import ManageDashboardUsers from '@/components/Dashboard/dashboardUsers/manageDashboardUsers';

export const Route = createFileRoute('/dashboard/_dashLayout/dashboard-users')({
  component: ManageDashboardUsers,
})

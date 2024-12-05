import { createFileRoute } from '@tanstack/react-router'
import Appointments from '@/components/Dashboard/appointments/appointments'

export const Route = createFileRoute('/dashboard/_dashLayout/appointments')({
  component: Appointments,
})

import { createFileRoute } from '@tanstack/react-router'
import Doctors from '@/components/Dashboard/doctors/doctors';

export const Route = createFileRoute('/dashboard/_dashLayout/doctors-details')({
  component: Doctors,
})

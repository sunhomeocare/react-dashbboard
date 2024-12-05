import { createFileRoute } from '@tanstack/react-router';
import DoctorsAvailability from '@/components/Dashboard/doctorsUnavailbility/doctorsAvailability';

export const Route = createFileRoute(
  '/dashboard/_dashLayout/doctors-availability',
)({
  component: DoctorsAvailability
})

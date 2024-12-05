import { createFileRoute } from '@tanstack/react-router';
import AppointmentRatings from '@/components/Dashboard/appointmentsRatings/appointmentRatings';

export const Route = createFileRoute(
  '/dashboard/_dashLayout/appointment-ratings',
)({
  component: AppointmentRatings
})

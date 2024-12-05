import { createFileRoute } from '@tanstack/react-router';
import PatientUsers from '@/components/Dashboard/patients/patientUsers';

export const Route = createFileRoute('/dashboard/_dashLayout/patient-users')({
  component: PatientUsers,
})

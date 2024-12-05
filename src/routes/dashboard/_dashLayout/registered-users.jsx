import { createFileRoute } from '@tanstack/react-router';
import RegisteredUsers from '@/components/Dashboard/registeredUsers/registeredUsers';

export const Route = createFileRoute('/dashboard/_dashLayout/registered-users')(
  {
    component: RegisteredUsers,
  },
)

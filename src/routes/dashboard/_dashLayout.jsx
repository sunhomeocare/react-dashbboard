import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardLayout from "@/components/Dashboard/dashboardLayout";
import { isValidAuthTokenPresent } from "@/lib/helper/isAuthTokenPresent";
import { useUserDetailsStore } from "@/lib/store";
import { decodeToken } from "react-jwt";

export const Route = createFileRoute("/dashboard/_dashLayout")({
  component: () => <DashboardLayout />,
  loader: () => {
    if (!isValidAuthTokenPresent()) {
      const removeUser = useUserDetailsStore.getState().removeUser;
      removeUser();
      return redirect({
        to: "/",
      });
    } else {
      const decodedToken = decodeToken(localStorage.getItem("auth_token"));
      const setUser = useUserDetailsStore.getState().setUser;

      setUser({
        id: decodedToken.id,
        username: decodedToken.username,
        role: decodedToken.role,
      });
    }
  },
});

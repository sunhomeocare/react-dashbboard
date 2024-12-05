import { createFileRoute, redirect } from "@tanstack/react-router";
import LandingPage from "@/components/LandingPage/landingPage";
import { isValidAuthTokenPresent } from "@/lib/helper/isAuthTokenPresent";
import { useUserDetailsStore } from "@/lib/store";
import { decodeToken } from "react-jwt";

export const Route = createFileRoute("/")({
    component: () => (<LandingPage />),
    loader: () => {
        if(isValidAuthTokenPresent()) {
            const decodedToken = decodeToken(localStorage.getItem("auth_token"));
            const setUser = useUserDetailsStore.getState().setUser;

            setUser({
                id: decodedToken.id,
                username: decodedToken.username,
                role: decodedToken.role
            })
            return redirect({
                to: "/dashboard"
            })
        }
    }
})

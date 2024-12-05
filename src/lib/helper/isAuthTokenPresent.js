import { isExpired } from "react-jwt";

export const isValidAuthTokenPresent = () => {
    const auth_token = localStorage.getItem("auth_token");
    if(!auth_token) {
        return false;
    }

    const isMyTokenExpired = isExpired(auth_token);
    if(isMyTokenExpired) {
        return false;
    }

    return true;
}
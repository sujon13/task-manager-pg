// src/hooks/useAppNavigate.jsx

import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

export function useAppNavigate() {
    const navigate = useNavigate();

    return {
        goHome: () => navigate(ROUTES.HOME),
        goLogin: () => navigate(ROUTES.LOGIN),
        goSignup: () => navigate(ROUTES.SIGNUP),
        goIncidents: () => navigate(ROUTES.INCIDENTS),
        goProfile: () => navigate(ROUTES.PROFILE),
        goVerifyOtp: () => navigate(ROUTES.VERIFY_OTP),
        goTo: (path) => navigate(path),
        replaceWith: (path) => navigate(path, { replace: true }),
        rawNavigate: navigate, // optional: access raw navigate if needed
    };
}

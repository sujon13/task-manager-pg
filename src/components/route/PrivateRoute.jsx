import { Navigate } from "react-router-dom";
import useUser from '../../hooks/useUser';
import PropTypes from 'prop-types';
import { ROUTES } from "../../routes";

export default function PrivateRoute({ children }) {
    const { isLoggedIn, loading } = useUser();

    if (loading) return <div>Loading...</div>; // Optional: show while checking auth

    if (!isLoggedIn) {
        // Redirect unauthenticated user to login
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return children; // User is authenticated
}

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
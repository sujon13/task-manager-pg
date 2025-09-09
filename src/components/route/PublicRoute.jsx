import { Navigate } from "react-router-dom";
import useUser from '../../hooks/useUser';
import PropTypes from 'prop-types';
import { ROUTES } from "../../routes";

const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading } = useUser();
    
    if (loading) return <div>Loading...</div>; // Optional: show while checking auth

    return isLoggedIn ? <Navigate to={ROUTES.HOME} /> : children; // Redirect to home if logged in
};

export default PublicRoute;

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
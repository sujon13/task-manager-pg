import { Navigate } from "react-router-dom";
//import { useAuth } from "./AuthContext"; // Import your auth context
import PropTypes from 'prop-types';

const PublicRoute = ({ isLoggedIn, children }) => {
    //const { isLoggedIn } = useAuth();

    return isLoggedIn ? <Navigate to="/" /> : children; // Redirect to home if logged in
};

export default PublicRoute;

PublicRoute.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};
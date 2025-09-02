// UserContext.js
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { get, post, auth } from '../services/api';
import UserContext from "./UserContext";


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, name, email, role }

    const fetchUserInfo = async () => {
        const { status, data } = await get(auth, "/users/me", { withCredentials: true });
        if (status === 200 && data) {
            setUser(data)
            //localStorage.setItem("userInfo", JSON.stringify(data));
            //setIsLoggedIn(true);
        } else {
            logout();
        }
    }

    // Restore by fetching from server on refresh
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const login = () => {
        fetchUserInfo();
        //localStorage.setItem("user", JSON.stringify(userData));
    };

    const logoutFromServer = async () => {
        const { status } = await post(auth, "/logout");
        if (status === 200) {
            setUser(null);
        }
    }

    const logout = () => {
        logoutFromServer();
        //localStorage.removeItem("user");
    };

    const isLoggedIn = !!user;

    return (
        <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node,
};

export default UserProvider;
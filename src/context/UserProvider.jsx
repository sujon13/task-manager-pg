// UserContext.js
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { get, post, auth } from '../services/api';
import UserContext from "./UserContext";
import { useAppNavigate } from '../hooks/useAppNavigate';


export const UserProvider = ({ children }) => {
    const { goLogin, goIncidents } = useAppNavigate();
    const [user, setUser] = useState(null); // { id, name, email, role }
    const [loading, setLoading] = useState(true);

    const fetchUserInfo = async (callback) => {
        const { status, data } = await get(auth, "/users/me", { withCredentials: true });
        if (status === 200 && data) {
            setUser(data)
            //localStorage.setItem("userInfo", JSON.stringify(data));
            //setIsLoggedIn(true);
            
            // if (typeof callback === "function") {
            //     callback();
            // }
            callback?.();
        } else {
            logout();
        }
        setLoading(false);
    }

    // Restore by fetching from server on refresh
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const login = () => {
        fetchUserInfo(() => goIncidents());
        //localStorage.setItem("user", JSON.stringify(userData));
    };

    const logoutFromServer = async (callback) => {
        const { status } = await post(auth, "/logout");
        if (status === 200) {
            callback();
        }
    }

    const logout = () => {
        logoutFromServer( () => {
            setUser(null);
            goLogin();
        });
        //localStorage.removeItem("user");
    };

    const isLoggedIn = !!user;

    return (
        <UserContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node,
};

export default UserProvider;
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
    const [ supervisor, setSupervisor ] = useState(false);

    const fetchUserInfo = async (callback) => {
        const { status, data } = await get(auth, "/users/me", { withCredentials: true });
        if (status === 200 && data) {
            setUser(data);
            checkAndSetSupervisor(data);
            callback?.();
        } else {
            logout();
        }
        setLoading(false);
    }

    const checkAndSetSupervisor = (user) => {
        const supervisorRoles = ['ADMIN', 'SCADA_SE', 'SMD_XEN'];
        setSupervisor(user?.roles?.some(role => supervisorRoles.includes(role.name)));
    }

    // Restore by fetching from server on refresh
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const login = (callback) => {
        fetchUserInfo(() => {
            if (typeof callback === 'function') {
                callback();
            } else {
                goIncidents();
            }
        });
        //localStorage.setItem("user", JSON.stringify(userData));
    };

    const logoutFromServer = async (callback) => {
        await post(auth, "/logout");
        callback();
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
        <UserContext.Provider value={{ user, isLoggedIn, login, logout, loading, supervisor }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node,
};

export default UserProvider;
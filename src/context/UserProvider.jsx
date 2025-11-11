// UserContext.js
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { get, post, auth } from '../services/api';
import UserContext from "./UserContext";
import { useAppNavigate } from '../hooks/useAppNavigate';
import { RoleEnum } from './RoleEnum';
import { isCnstXen, isSmdXen, isSupervisor } from "../services/util";


export const UserProvider = ({ children }) => {
    const { goLogin, goIncidents } = useAppNavigate();
    const [ user, setUser ] = useState(null); // { id, name, email, role }
    const [ loading, setLoading ] = useState(true);
    const [ supervisor, setSupervisor ] = useState(false);
    const [ admin, setAdmin ] = useState(false);
    const [ seScada, setSeScada ] = useState(false);
    const [ smdXen, setSmdXen ] = useState(false);
    const [ cnstXen, setCnstXen ] = useState(false);

    const fetchUserInfo = async (callback) => {
        const { status, data } = await get(auth, "/users/me", { withCredentials: true });
        if (status === 200 && data) {
            setUser(data);
            checkAndSetSupervisor(data);
            checkAndSetAdmin(data);
            checkAndSetSeScada(data);
            checkAndSetSmdXen(data);
            checkAndSetCnstXen(data);
            callback?.();
        } else {
            logout();
        }
        setLoading(false);
    }

    const checkAndSetSupervisor = (user) => {
        setSupervisor(isSupervisor(user));
    }

    const checkAndSetSmdXen = (user) => {
        setSmdXen(isSmdXen(user));
    }

    const checkAndSetCnstXen = (user) => {
        setCnstXen(isCnstXen(user));
    }

    const checkAndSetAdmin = user => {
        setAdmin(user?.roles?.some(role => RoleEnum.ADMIN.key === role.name));
    }

    const checkAndSetSeScada = user => {
        setSeScada(user?.roles?.some(role => RoleEnum.SCADA_SE.key === role.name));
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
        <UserContext.Provider value={{ user, isLoggedIn, login, logout, loading, supervisor, admin, seScada, smdXen, cnstXen }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node,
};

export default UserProvider;
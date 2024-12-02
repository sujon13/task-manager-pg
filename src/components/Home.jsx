import React, { useEffect, useState } from "react";
import { get } from '../services/api';

export const Home = ({ login }) => {
    const fetchUserInfo = async () => {
        const { status, data } = await get("/users/me");
        if (status === 200 && data) {
            localStorage.setItem("userInfo", JSON.stringify(data));
            login();
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
        <div className='container'>
            <h2>Welcome to ExamStudy School......!!!</h2>
            {/* <div><Link to="/signup">Sign Up</Link></div>
            <div><Link to="/login">Log In</Link></div> */}
        </div>
    )
}
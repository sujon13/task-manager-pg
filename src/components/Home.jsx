import { useEffect } from "react";
import { get } from '../services/api';

export const Home = ({ isLoggedIn, login }) => {
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
            {isLoggedIn ? (
                <h2>Welcome to ExamStudy School......!!!</h2>
            ) : (
                <h2>Please login to continue</h2>
            )}
            {/* <div><Link to="/signup">Sign Up</Link></div>
            <div><Link to="/login">Log In</Link></div> */}
        </div>
    )
}
import { useState } from "react";
import { Link } from "react-router-dom";
import './css/NavBar.css';
import useTheme from "../hooks/useTheme";

export const NavBar = () => {
    const [theme, toggleTheme] = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    return (
        <div className={`navbar ${theme}`}>
            <div className="navbar-logo"> <Link to="/">
                Exam <span style={{ color: "rgb(214, 150, 103)" }}>Study</span>School
                </Link>
            </div>
            <ul className={isMobile ? 'navbar-links-mobile' : 'navbar-links-one'}>
                <li><Link to="/questionbank">Question Bank</Link></li>
                <li><Link to="/liveexam">Live Exam</Link>
                </li>
                <li><Link to="/englishtutor">English Tutor</Link>
                </li>
            </ul>
            <ul className= 'navbar-links-two'>
                <li onClick={toggleTheme} className="theme-toggle">
                    {theme === 'light' ?  '🌜': '🌞'}
                </li>
                <li className="login"><Link to="/login">LogIn</Link></li>
                <li><Link to="/signup">SignUp</Link></li>
            </ul>
            <button className="mobile-menu-icon" onClick={() => setIsMobile(!isMobile)}>
            ☰
            </button>
        </div>
    )
}
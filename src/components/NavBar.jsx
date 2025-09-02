import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import useTheme from "../hooks/useTheme";
import useUser from "../hooks/useUser";
import { ROUTES } from "../routes";
import { useAppNavigate } from "../hooks/useAppNavigate";

export const NavBar = () => {
    const { isLoggedIn, logout } = useUser();
    const { goProfile } = useAppNavigate();
    const [theme, toggleTheme] = useTheme();

    return (
        <Navbar
            expand="md"
            bg={theme === "light" ? "light" : "dark"}
            variant={theme === "light" ? "light" : "dark"}
            className="shadow-sm"
            collapseOnSelect
        >
            <Container>
                {/* Mobile toggle button */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* Menu links */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to={ROUTES.INCIDENTS}>
                            Incidents
                        </Nav.Link>

                        {/* Theme Toggle */}
                        <Nav.Link onClick={toggleTheme}>
                            {theme === "light" ? "🌜" : "🌞"}
                        </Nav.Link>

                        {/* Logged-in user items */}
                        {isLoggedIn && (
                        <>
                            <Nav.Link onClick={goProfile}>
                                <FaUserCircle size={24} title="Profile" />
                            </Nav.Link>
                            <Nav.Link onClick={logout}>Logout</Nav.Link>
                        </>
                        )}

                        {/* Guest items */}
                        {!isLoggedIn && (
                        <Nav.Link as={Link} to={ROUTES.LOGIN}>
                            Login
                        </Nav.Link>
                        )}
                        {!isLoggedIn && (
                        <Nav.Link as={Link} to={ROUTES.SIGNUP}>
                            Sign Up
                        </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

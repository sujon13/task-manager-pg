import { Link } from 'react-router-dom';

const LoginLink = () => {
    return (
        <div style={{ paddingTop: "10px", textAlign: "center" }}>
            Already have an account? <Link to="/login" style={{ color: "green" }}>Log In</Link>
        </div>
    )
}

export default LoginLink;
import { Link } from 'react-router-dom';

const SignupLink = () => {
    return (
        <div style={{ paddingTop: "10px", textAlign: "center" }}>
            Does not have an account? <Link to="/signup" style={{ color: "green" }}>Sign Up</Link>
        </div>
    )
}

export default SignupLink;
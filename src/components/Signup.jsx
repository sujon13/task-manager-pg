import googleIcon from '../assets/google128.png';
import { checkUsernameAvailability } from '../services/api'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Signup = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Validation function
    const validateUsername = (value) => {
        if (value.length < 3 || value.length > 10) {
            return 'Username must be at least 3 characters long.';
        }
        if (value.length > 10) {
            return 'Username must be at max 20 characters long.';
        }
        if (!/^[a-zA-Z0-9_.]+$/.test(value)) {
            return 'Username can only contain letters, numbers, dot and underscores.';
        }
        return '';
    };
    // Handle input change
    const handleUsername = async (e) => {
        const value = e.target.value;
        setUsername(value);

        const validationError = validateUsername(value);
        setError(validationError);

        if (validationError == '') {
            const v = await checkUsernameAvailability(value);
            v == false ? setUsername(value) : setError('Username has been taken!');
        }
    };

    return (
        <div className="form">
            <h1>Sign Up</h1>
            <form>
                <input
                    type="text"
                    placeholder="username"
                    onBlur={handleUsername}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input type="text" placeholder="Name*" id="name" />
                <input type="email" placeholder="Email*" id="mail" required /><br />
                {/* <input type="phone" placeholder="Phone Number" id="phone" /><br /> */}
                <input type="password" placeholder="Password*" id="password" required /><br />
                <input type="password" placeholder="Confirm Password*" id="confirmPassword" required /><br />
                <input type="button" id="signup" value="Sign Up" />
            </form>
            <div style={{ paddingTop: "25px" }}>Already have an account? <Link to="/login" style={{ color: "green" }}>Log In</Link></div>
        </div>)
}
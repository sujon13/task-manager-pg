import googleIcon from '../assets/google128.png';
import { checkUserNameAvailability, signupSubmit } from '../services/api'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Signup = () => {
    const [userName, setUsername] = useState('');
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');

    const [error, setError] = useState('');
    const [passError, setPassError] = useState('');
    const [cPassError, setCPassError] = useState('');
    const [mailError, setMailError] = useState('');

    const [responseMessage, setResponseMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Useename Validation function
    const validateUsername = (value) => {
        if (value.length < 3)
            return 'Username must be at least 3 characters long.';

        if (value.length > 20)
            return 'Username must be at max 20 characters long.';

        if (!/^[a-zA-Z0-9_.-]+$/.test(value))
            return 'Username can only contain letters, numbers, dot, hyphen and underscores.';

        return '';
    };

    // Handle input change
    const handleUsername = async (e) => {
        const value = e.target.value;
        setUsername(value);

        const validationError = validateUsername(value);
        setError(validationError);

        if (validationError == '') {
            const v = await checkUserNameAvailability(value);
            v == false ? setUsername(value) : setError('Username has been taken!');
        }
    };
    
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    const handleMail = (e) => {
        const value = e.target.value;
        setMail(value);

        if (mail == null) setMailError('Email is required');
        if (isValidEmail(value) == false) setMailError('Invalid Mail.')

    }
    
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,64}$/;
        if (!passwordRegex.test(password))
            return 'Password must be 6-64 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.';

    }
    
    const handlePassword = (e) => {
        const value = e.target.value;
        setPassword(value);

        const validationError = validatePassword(value);
        setPassError(validationError);
    }

    //handle Confirm Password
    const handleCPassword = (e) => {
        const value = e.target.value;
        setCPassword(value);
        if (password !== value) setCPassError('Passwords don not match.');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const signupRequest = {
            "userName": userName,
            "email": mail,
            "rawPassword": password,
            "reTypeRawPassword": cPassword
        }

        try {
            const response = await signupSubmit(signupRequest);
            console.log('response: ', response);
            setResponseMessage("Signup successful!"); // Success message
            setErrorMessage(""); // Clear any error
        } catch (error) {
            console.error('error status: ', error.response?.status);
            if (error.response?.data) {
                console.error('error data: ', error.response?.data);
            }
            setResponseMessage("");
            setErrorMessage(error.response?.data?.message || "An error occurred");
        }

    }

    return (
        <div className="form">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    onBlur={handleUsername}
                    onFocus={() => setError('')}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="text"
                    placeholder="Your Name"
                    id="name"
                />
                <input
                    type="email"
                    placeholder="email*"
                    onBlur={handleMail}
                    onFocus={() => { setMailError('') }}
                    required
                />
                {mailError && <p style={{ color: 'red' }}>{mailError}</p>}
                <input
                    type="password"
                    placeholder="password*"
                    onBlur={handlePassword}
                    onFocus={() => { setPassError('') }}
                    required
                />
                {passError && <p style={{ color: 'red' }}>{passError}</p>}
                <input
                    type="password"
                    placeholder="Confirm Password*"
                    onBlur={handleCPassword}
                    onFocus={()=>setCPassError('')}
                    required
                />
                {cPassError && <p style={{ color: 'red' }}>{cPassError}</p>}
                <button type='submit'>
                    Sign Up
                </button>
                {responseMessage && <p style={{ color: "green" }}>{responseMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {/* <input type="button" id="signup" value="Sign Up"  /> */}
            </form>
            <div style={{ paddingTop: "25px" }}>Already have an account? <Link to="/login" style={{ color: "green" }}>Log In</Link></div>
        </div>)
}
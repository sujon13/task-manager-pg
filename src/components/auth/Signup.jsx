import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

import '../css/Signup.css';
import '../css/Social.css';
import { get, post, auth } from '../../services/api';
import LoginLink from './LoginLink';
import { getUrl } from '../../services/util';
import PasswordInput from './PasswordInput';
import Title from '../util/Title';


export const Signup = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');

    const [userNameError, setUserNameError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passError, setPassError] = useState('');
    const [cPassError, setCPassError] = useState('');
    const [mailError, setMailError] = useState('');

    const [responseMessage, setResponseMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Username Validation function
    const validateUserName = (value) => {
        if (value.length < 3)
            return 'UserName must be at least 3 characters long.';

        if (value.length > 20)
            return 'UserName can be max 20 characters long.';

        if (!/^[a-zA-Z0-9._-]{3,20}$/.test(value))
            return 'UserName can only contain letters, digits, underscores, hyphens, and dots';

        return '';
    };

    // Handle input change
    const handleUserName = async (e) => {
        const rawValue = e.target.value;
        if (rawValue === null || rawValue === undefined || rawValue === '') {
            setUserNameError('Username is required');
            return;
        }

        const userName = rawValue.trim();
        setUserName(userName);

        const validationError = validateUserName(userName);
        setUserNameError(validationError);

        if (validationError === '') {
            const paramMap = { userName: userName };
            const { status, data } = await get(auth, '/signup/checkUserName', paramMap);
            if (status === 200 && data) {
                setUserNameError('UserName has been taken!');
            }
        }
    };

    const handleName = (e) => {
        const rawValue = e.target.value;
        if (rawValue === null || rawValue === undefined || rawValue === '') {
            setNameError('Name is required');
            return;
        }

        const name = rawValue.trim();
        setName(name);
    }
    
    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    const handleMail = (e) => {
        const rawValue = e.target.value;
        if (rawValue === null || rawValue === undefined || rawValue === '') {
            setMailError('Email is required');
            return;
        }

        const email = rawValue.trim();
        setMail(email);

        if (!isEmailValid(email)) 
            setMailError('Invalid Mail.')
    }
    
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,64}$/;
        if (!passwordRegex.test(password))
            return 'Password must be 6-64 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.';

        return '';
    }
    
    const handlePassword = (e) => {
        const rawValue = e.target.value;
        if (rawValue === null || rawValue === undefined || rawValue === '')
            return;

        const password = rawValue.trim();
        setPassword(password);

        const validationError = validatePassword(password);
        setPassError(validationError);
    }

    //handle Confirm Password
    const handleCPassword = (e) => {
        const rawValue = e.target.value;
        if (rawValue === null || rawValue === undefined || rawValue === '')
            return;

        const cPassword = rawValue.trim();
        setCPassword(cPassword);
        if (password !== cPassword) setCPassError('Passwords do not match.');
    }

    const anyError = () => {
        return mailError !== '' || passError !== '' || cPassError !== '';
    }

    const goToOtpVerification = (paramMap) => {
        const url = getUrl('/verify-otp', paramMap);
        navigate(url);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (anyError()) return;

        const signupRequest = {
            //"userName": retrieveUserName(mail),
            name: name,
            email: mail,
            rawPassword: password,
            reTypeRawPassword: cPassword
        }

        const { status, data } = await post(auth, '/signup', signupRequest);
        if (status >= 200 && status < 300) {
            setResponseMessage("Signup successful!"); // Success message
            goToOtpVerification(data);
        } else {
            if (data === null || data === undefined) {
                setErrorMessage("An error occurred");
                return;
            }

            setErrorMessage(data);
        }  

    }

    return (
        <div className="form">
            <Title/>
            <form onSubmit={handleSubmit}>
                <Form.Control
                    type="text"
                    placeholder="Your Name*"
                    id="name"
                    onBlur={handleName}
                    onFocus={() => { setNameError('') }}
                    required
                />
                <Form.Control
                    type="email"
                    placeholder="email*"
                    onBlur={handleMail}
                    onFocus={() => { setMailError('') }}
                    required
                />
                {mailError && <p className="error-style">{mailError}</p>}
                {/* <input
                    type="password"
                    placeholder="password*"
                    onBlur={handlePassword}
                    onFocus={() => { setPassError('') }}
                    required
                /> */}
                <PasswordInput
                    placeholder="password*"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePassword}
                    onFocus={() => { setPassError('') }}
                />
                {passError && <p className="error-style">{passError}</p>}
                <PasswordInput
                    placeholder="Confirm Password*"
                    value={cPassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    onBlur={handleCPassword}
                    onFocus={() => { setCPassError('') }}
                />
                {cPassError && <p className="error-style">{cPassError}</p>}
                {responseMessage && <p className="success-style">{responseMessage}</p>}
                {errorMessage && <p className="error-style" style={{ marginTop: '0px' }}>{errorMessage}</p>}
                <Button 
                    variant='success' 
                    type='submit' 
                    className='w-100 mt-5'
                >
                    Sign Up
                </Button>

                {/* <input type="button" id="signup" value="Sign Up"  /> */}
            </form>
            <LoginLink />
        </div>)
}
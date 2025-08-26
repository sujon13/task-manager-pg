import PropTypes from 'prop-types';
import { post, auth } from '../../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../css/Signup.css';
import '../css/Social.css';
import SocialLogin from './SocialLogin';
import SignupLink from './SignupLink';

export const Login = ({ login }) => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const goToHome = () => {
        navigate('/');
    }

    const handleSubmit = async () => {
        if (!userName || !password) {
            setError('Please enter a username and password');
            return;
        }

        const authRequest = {
            userName,
            password
        };

        const { status, data } = await post(auth, '/authenticate', authRequest);
        if (status === 200) {
            console.log(`User ${userName} logged in successfully`);
            login();
            goToHome();
        } else if (status === 400) {
            setError(data);
        } else if (status === 401) {
            setError(data);
        } else {
            setError('Something went wrong. Please try again later.');
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            <Form>
                <Form.Group>
                    <Form.Control 
                        type="text" 
                        className="w-100 mb-3"
                        placeholder="username" 
                        value={userName}
                        onChange={e => setUserName(e.target.value)} 
                        onFocus={() => setError('')}
                        required
                    />
                    <Form.Control 
                        type="password" 
                        className="w-100"
                        placeholder="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                        onFocus={() => setError('')}
                        required
                    />
                    {error && <p className="error-style">{error}</p>}
                </Form.Group>
                <Button 
                    variant="success" 
                    type="button" 
                    onClick={handleSubmit}
                    className="w-100 mt-3"
                >
                    Login
                </Button>
                <SignupLink />
            </Form>
        </div>
    )
    
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
};
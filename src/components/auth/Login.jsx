import PropTypes from 'prop-types';
import { post, auth } from '../../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Signup.css';
import '../css/Social.css';
import SignupLink from './SignupLink';
import PasswordInput from './PasswordInput';
import { Container, Form, Button, Card } from "react-bootstrap";
import SuccessToast from './SuccessToast';

export const Login = ({ login }) => {
    const navigate = useNavigate();

    const [userNameOrEmail, setUserNameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);

    const autohideTimeInMillis = 2000;
    const adminWhatsapp = '01730016065';
    const adminEmail = 'ae2.scada@pgcb.gov.bd';


    const goToHome = () => {
        navigate('/');
    }

    const showSuccessToast = (callback) => {
        setShowToast(true);
        setTimeout(() => {
            callback();
        }, autohideTimeInMillis);
    }

    const handleSubmit = async () => {
        if (!setUserNameOrEmail || !password) {
            setError('Please enter user name/email and password');
            return;
        }

        const authRequest = {
            userNameOrEmail,
            password
        };

        const { status, data } = await post(auth, '/authenticate', authRequest);
        if (status === 200) {
            console.log(`User ${userNameOrEmail} logged in successfully`);
            showSuccessToast(() => {
                login();
                goToHome();
            })
        } else if (status === 400) {
            setError(data);
        } else if (status === 401) {
            if (typeof data === 'string') {
                console.error(data);
                setError(data);
            } else {
                const { errorMessage } = data;
                const error = `${errorMessage}. Please contact with admin by whats App (${adminWhatsapp}) or by email (${adminEmail})`;
                setError(error);
                console.error(error);
            }
        } else {
            setError('Something went wrong. Please try again later.');
        }

    }

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-80"
        >
            <Card style={{ width: "30rem" }} className={ "p-4 shadow-lg " + (showToast ? 'disabled-overlay' : '') }>
                <Form>
                    <Form.Control 
                        type="text" 
                        className="mb-3"
                        placeholder="Enter username or email" 
                        value={userNameOrEmail}
                        onChange={e => setUserNameOrEmail(e.target.value)} 
                        onFocus={() => setError('')}
                        required
                    />
                    <PasswordInput
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => { setError('') }}
                    />
                    {error && <p className="error-style mt-3" style={{ marginTop: '0px' }}>{error}</p>}
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
            </Card>
            <SuccessToast
                onClose={() => setShowToast(false)}
                show={showToast}
                autohideTimeInMillis={autohideTimeInMillis}       
                toastBody={ 'Successfully Logged In'}
            >
            </SuccessToast>
        </Container>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
};
import { post, auth } from '../../services/api';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../css/Signup.css';
import '../css/Social.css';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export const CreateUserName = () => {
    const location = useLocation();
    const { goHome } = useAppNavigate();
    
    const [userName, setUserName] = useState('');

    const [userNameError, setUserNameError] = useState('');

    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get('userId');
    const accountId = urlParams.get('accountId');
    const state = urlParams.get('state');    

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

    const registerUserName = async () => {
        const userNameRequest = {
            userId,
            accountId,
            userName,
            state
        };

        const { status, data } = await post(auth, '/oauth2/register', userNameRequest);
        if (status === 200) {
            console.log(`User Name ${userName} registered successfully`);
            goHome();
        } else if (status === 409) {
            console.log("user name: ", userName);
            setUserNameError(data + ' Please try another user Name.');
        } else if (status === 403) {
            setUserNameError(data);
        } else {
            setUserNameError('Something went wrong. Please try again later.');
        }
    }

    const handleSubmit = async () => {
        if (userNameError) {
            return;
        }

        const validationError = validateUserName(userName);
        setUserNameError(validationError);

        if (validationError === '') {
            registerUserName();
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            <Form>
                <Form.Group>
                    <Form.Label className='w-100 text-center'>
                        User Name
                    </Form.Label>
                    <Form.Control 
                        type="text" 
                        className="w-100"
                        placeholder="Choose a username" 
                        value={userName}
                        onChange={e => setUserName(e.target.value)} 
                        onFocus={() => setUserNameError('')}
                    />
                    {userNameError && <p className="error-style">{userNameError}</p>}
                </Form.Group>
                <Button 
                    variant="outline-primary" 
                    type="button" 
                    onClick={handleSubmit}
                    className="w-100 mt-3"
                >
                    Submit
                </Button>
            </Form>
        </div>
    )
}
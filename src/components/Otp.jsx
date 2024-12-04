import { post, auth } from '../services/api';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './css/Signup.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const OtpVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [otp, setOtp] = useState('');
    const [otpId, setOtpId] = useState('');
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60); // Initial timer value in seconds
    const [resendDisabled, setResendDisabled] = useState(true);

    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get('userId');
    const userName = urlParams.get('userName');
    const email = urlParams.get('email');

    const sendOtp = async () => {
        const otpRequest = {
            userId,
            email
        }
        const { status, data } = await post(auth, '/signup/send-otp', otpRequest);
        if (status === 200) {
            console.log(`OTP sent to ${email}`);
            setOtpId(data.id);
        } else {
            console.error('Error sending OTP');
        }
    }

    useEffect(() => {
        sendOtp();
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);

            return () => clearInterval(interval); // Clear interval on component unmount
        } else {
            setResendDisabled(false); // Enable the resend button when timer ends
        }
    }, [timer]);
    
    const handleResend = () => {
        sendOtp();
        setTimer(60); // Reset the timer
        setResendDisabled(true); // Disable the resend button
    };

    const goToLogin = () => {
        navigate('/login');
    }

    const handleSubmit = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid OTP');
            return;
        }

        const otpRequest = {
            id: otpId,
            userId,
            otp
        };

        const { status, data } = await post(auth, '/signup/verify-otp', otpRequest);
        if (status === 200) {
            console.log(`OTP verified for user ${userName}`);
            goToLogin();
        } else if (status === 400) {
            setError(data);
        } else {
            setError('Something went wrong. Please try again later.');
        }
    }

    const handleOtpChange = (e) => {
        const rawValue = e.target.value;
        if (rawValue.length > 6) {
            return;
        }
        setOtp(rawValue);
    }

    return (
        <Container className='text-center' style={{ marginTop: "60px" }}>
            <Row>
                <Col>
                    <h2>OTP Verification</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    Enter the OTP sent to your email
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center align-items-center'>
                    <Form className='mt-3'>
                        <Form.Group>
                            <Form.Control 
                                className='mb-2'
                                type="number" 
                                placeholder="OTP" 
                                value={otp}
                                onChange={e => handleOtpChange(e)} 
                                onFocus={() => setError('')}
                            />
                            {error && <p className="error-style">{error}</p>}
                        </Form.Group>
                        <Row className="mt-1 align-items-center">
                            <Col xs={2} className="text-muted text-start">
                                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                            </Col>
                            <Col xs={10} className="text-end d-flex justify-content-end align-items-center">
                                <span className='text-muted'>
                                    Did not get the OTP? 
                                </span>
                                <Button
                                    variant="link"
                                    className="p-0"
                                    disabled={resendDisabled}
                                    onClick={handleResend}
                                >
                                    Resend
                                </Button>
                            </Col>
                        </Row>
                        <Button 
                            className='mt-3'
                            variant="success" 
                            type="button" 
                            onClick={handleSubmit}
                            disabled={otp.length !== 6}
                        >
                            Verify OTP
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
    
}

export default OtpVerification;
import { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import useUser from "../../hooks/useUser";
import Confirmation from '../util/Confirmation';
import ToastNotification  from "../util/ToastNotification";
import { put, auth } from '../../services/api';

export default function Profile() {
    const { user, login } = useUser();

    const [name, setName] = useState(user?.name || "");
    
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);


    const handleOk = (callback) => {
        login(() => {});
        setTimeout(() => {
            setIsLoading(false);
            if (callback)callback();
        }, 500);
    }

    const handleError = (error) => {
        setTimeout(() => {
            setIsLoading(false);
            console.error(error);
        }, 500);
    }

    const updateName = async () => {
        const userRequest = {
            id: user.userId,
            name
        };

        setIsLoading(true);
        
        const { status, data } = await put(auth, '/users', userRequest);
        if (status >= 200 && status < 300) {
            closeConfirmationModal();
            handleOk(() => setShowToast(true));
        } else {
            handleError(data);
        }
    };

    const closeConfirmationModal = () => {
        setShowConfirmation(false);
    }

    const showConfirmationModal = () => {
        setShowConfirmation(true);
    }

    const closeToast = () => {
        setShowToast(false);
    }

    if (!user) return <p>Loading...</p>;

    return (
        <Container className="my-5">
            <Confirmation
                show={ showConfirmation }
                onConfirm={ updateName }
                onCancel={ closeConfirmationModal }
                
            />
            <ToastNotification
                show={ showToast }
                onClose={ closeToast }
                title="Success"
                message='Name updated successfully!'
            />
            {isLoading && 
                <div className="d-flex justify-content-center mt-100">
                    <Spinner animation="border" variant="primary" />
                </div>
            }
            <Row className="justify-content-center" style={{ display: isLoading ? 'none' : 'flex' }}>
                <Col sm={8} md={6} lg={5}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white text-center">
                            <h4 className="mb-0">Profile</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                {/* Username - readonly */}
                                <Form.Group className="mb-1">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="text" value={user.userName} readOnly />
                                </Form.Group>

                                {/* Email - readonly */}
                                <Form.Group className="mb-1">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={user.email} readOnly />
                                </Form.Group>

                                {/* Roles - readonly */}
                                <Form.Group className="mb-1">
                                    <Form.Label>Roles</Form.Label>
                                    <Form.Control type="text" value={user.roles.join(", ")} readOnly />
                                </Form.Group>

                                {/* Name - editable */}
                                <Form.Group className="mb-2">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    className="w-100"
                                    onClick={ () => showConfirmationModal() }
                                >
                                    Update Name
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

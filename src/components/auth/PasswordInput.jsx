import { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import PropTypes from 'prop-types';

const PasswordInput = ({placeholder, value, onChange, onBlur, onFocus}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputGroup>
            <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder={placeholder || "Password*"}
                required
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
            />
            <Button
                variant="outline-secondary" className="password-design"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
        </InputGroup>
    );
}

PasswordInput.propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func.isRequired,
};

export default PasswordInput;
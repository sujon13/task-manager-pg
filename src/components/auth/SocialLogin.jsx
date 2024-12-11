import googleIcon from '../../assets/google128.png';
import { get, auth } from '../../services/api';
import '../css/Signup.css';
import '../css/Social.css';

const SocialLogin = () => {
    const handleGoogleSignin = async () => {
        console.log("Google Signin Started");
        
        const { status, data, headers } = await get(auth, '/oauth2/google/authenticate');
        if (status >= 200 && status < 300) {
            console.log("Will redirect to google auth page");
            window.location.href = data;
        } else if (status === 302 && headers.location) {
            // Redirect the browser to the location provided by the backend
            console.log("Will redirect to: ", headers.location);
            window.location.href = headers.location;
        } else {
            console.log("Google Signin Failed");
        }
    }

    return (
        <div className="social-login">
            <div className="divider">
                <span>OR</span>
            </div>
            <button type="button" className="google-login-btn" onClick={handleGoogleSignin}>
                <img 
                    src={googleIcon} 
                    alt="Google Icon" 
                    className="google-icon"
                />
                Continue with Google
            </button>
        </div>
    )
}

export default SocialLogin;
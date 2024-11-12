import googleIcon from '../assets/google128.png';
import { Link } from 'react-router-dom';
export const Signup = () =>{
    return (
    <div className="form">
        <h1>Sign Up</h1>
        <form>
            <input type="text" placeholder="Name*" id="name" required/><br/>
            <input type="email" placeholder="Email*" id="mail" required/><br/>
            <input type="phone" placeholder="Phone Number" id="phone" /><br/>
            <input type="password" placeholder="Password*" id="password" required/><br/>
            <input type="password" placeholder="Confirm Password*" id="confirmPassword" required/><br/>
            <input type="button" id="signup" value="Sign Up"/>
        </form>
        <div style={{paddingTop:"25px"}}>Already have an account? <Link to ="/login" style={{color:"green"}}>Log In</Link></div>
    </div>)
}
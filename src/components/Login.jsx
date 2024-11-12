import { Link } from "react-router-dom"
export const Login = () =>{
    return(
        <div className="form">
        <h1>Log In</h1>
        
        <form>
            <input type="email" placeholder="Email*" id="mail" required/><br/>
            <input type="password" placeholder="Password*" id="password" required/><br/>
            <div id="forgotPass">Forgot Password?</div>
            <input type="button" id="login" value="Log In"/>
        </form>
        <div style={{paddingTop:"25px"}}>Don't have an account? <Link to ="/signup" style={{color:"green"}}>Sign Up</Link></div>
    </div>
    )
}
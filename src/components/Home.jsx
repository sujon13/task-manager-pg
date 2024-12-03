import PropTypes from 'prop-types';

export const Home = ({ isLoggedIn }) => {

    return (
        <div className='container'>
            {isLoggedIn ? (
                <h2>Welcome to ExamStudy School......!!!</h2>
            ) : (
                <h2>Please login to continue</h2>
            )}
            {/* <div><Link to="/signup">Sign Up</Link></div>
            <div><Link to="/login">Log In</Link></div> */}
        </div>
    )
}

Home.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
};

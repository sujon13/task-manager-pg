import PropTypes from 'prop-types';
import { get, qa } from '../services/api';

export const Home = ({ isLoggedIn }) => {
    const test = async () => {
        try {
            const response = await get(qa, '/posts', { withCredentials: true });
            console.log('status: ' + response.status);
            console.log('posts: ' + response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    if (isLoggedIn) {
        //test();
    }

    return (
        <div className='d-flex justify-content-center align-items-center' style={{ marginTop: '20px' }}>
            {isLoggedIn ? (
                <h2>Welcome to Power Grid Task Tracker</h2>
            ) : (
                <h2>Please login to continue to Power Grid Task Tracker</h2>
            )}
            {/* <div><Link to="/signup">Sign Up</Link></div>
            <div><Link to="/login">Log In</Link></div> */}
        </div>
    )
}

Home.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
};

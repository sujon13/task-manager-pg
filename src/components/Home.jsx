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
        test();
    }

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

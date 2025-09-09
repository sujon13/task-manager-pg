import useUser from '../hooks/useUser';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../routes';

export const Home = () => {
    const { isLoggedIn } = useUser();

    if (isLoggedIn) {
        //test();
    }

    return (
        <div className='d-flex justify-content-center align-items-center' style={{ marginTop: '20px' }}>
            {isLoggedIn 
                ? <Navigate to={ROUTES.INCIDENTS}/> 
                : ( <h2>Please login to continue to Power Grid Task Tracker</h2>)
            }
        </div>
    )
}
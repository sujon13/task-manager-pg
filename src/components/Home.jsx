import useUser from '../hooks/useUser';
import { useAppNavigate } from '../hooks/useAppNavigate';

export const Home = () => {
    const { isLoggedIn } = useUser();
    const { goIncidents } = useAppNavigate();

    if (isLoggedIn) {
        //test();
    }

    return (
        <div className='d-flex justify-content-center align-items-center' style={{ marginTop: '20px' }}>
            {isLoggedIn ? (
                goIncidents()
            ) : (
                <h2>Please login to continue to Power Grid Task Tracker</h2>
            )}
        </div>
    )
}
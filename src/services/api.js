import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

const getUrl = (path, paramMap) => {
    let url = path;
    if (paramMap) {
        url += '?' + Object.entries(paramMap).map(([key, value]) => `${key}=${value}`).join('&');
    }
    return url;
}

const handleError = error => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        console.error('Error status: ', error.response.status);
        //console.error('Error headers: ', error.response.headers);
        if (error.response.data) {
            console.error('Error data: ', error.response.data);
            return {
                status: error.response.status,
                data: error.response.data
            }
        } else {
            console.warn('No data in error response');
            return {
                status: error.response.status
            }
        }

    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error('Error request: ', error.request);
        return {
            data: error.request
        }
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message: ', error.message);
        return {
            data: error.message
        }
    }
}

export const get = async (path, paramMap) => {
    try {
        const url = getUrl(path, paramMap);
        console.info('get URL: ', url);

        const response = await api.get(url);
        console.log('Status: ', response.status);

        if (response.data !== null && response.data !== undefined) {
            console.info('response data: ', response.data);
            return { status: response.status, data: response.data };
        } else {
            console.warn('No data in response');
            return { status: response.status };
        }
    } catch (error) {
        return handleError(error);
    }
}

export const post = async (path, body) => {
    try {
        const url = getUrl(path);
        console.info('post URL: ', url);
        const response = await api.post(url, body);
        console.log('Status: ', response.status);

        if (response.data !== null && response.data !== undefined) {
            console.info('response data: ', response.data);
            return { status: response.status, data: response.data };
        } else {
            console.warn('No data in response');
            return { status: response.status };
        }
    } catch (error) {
        return handleError(error);
    }
}

export const getPosts = () => {
    return post('/posts');
}

export const checkUserNameAvailability = async (value) => {
    return get('/signup/checkUserName', { userName: value });
};

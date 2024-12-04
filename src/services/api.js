import axios from 'axios';
import { getUrl } from './util';

export const auth = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

export const qa = axios.create({
    baseURL: "http://localhost:8085/api/v1",
});

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

export const get = async (service, path, paramMap, withCredentials = true) => {
    try {
        const url = getUrl(path, paramMap);
        console.info('get URL: ', url);

        const response = await service.get(url, { withCredentials: withCredentials });
        console.log('Status: ', response.status);

        if (response.data !== null && response.data !== undefined) {
            console.info('response data: ', response.data);
            return { 
                status: response.status, 
                data: response.data, 
                headers: response.headers
            };
        } else {
            console.warn('No data in response');
            return { 
                status: response.status, 
                headers: response.headers
            };
        }
    } catch (error) {
        return handleError(error);
    }
}

export const post = async (service, path, body, withCredentials = true) => {
    try {
        const url = getUrl(path);
        console.info('post URL: ', url);
        console.info('post body: ', body);
        const response = await service.post(url, body, { withCredentials: withCredentials });
        console.log('Status: ', response.status);

        if (response.data !== null && response.data !== undefined) {
            console.info('response data: ', response.data);
            return { 
                status: response.status, 
                data: response.data, 
                headers: response.headers
            };
        } else {
            console.warn('No data in response');
            return { 
                status: response.status, 
                headers: response.headers
            };
        }
    } catch (error) {
        return handleError(error);
    }
}

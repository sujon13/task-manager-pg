import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

export const getPosts = () =>{
    return api.get("/posts");
}

export const checkUserNameAvailability = async (value) => {
    const response = await api.get(`/signup/checkUserName?userName=${value}`);
    console.log('Status: ', response.status);
    return response.data;
};

export const signupSubmit = async(formData) => {
    const response = await api.post(`/signup`, formData);
    console.log('Status: ', response.status);
    return response.data;
};
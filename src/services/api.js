import axios from 'axios';

const api = axios.create({
    baseURL : "http://localhost:8080/api/v1",
});
//baseURL : "https://jsonplaceholder.typicode.com/",
//"localhost:8080/api/v1/signup/checkUserName?userName=user2",

export const getPosts = () =>{
    return api.get("/posts");
}

export const checkUsernameAvailability = async (value) => {
    const response = await api.get(`/signup/checkUserName?userName=${value}`);
    console.log(response);
    // console.log(response.data);
    return response.data;
  };

export const signupSubmit = async(formData) =>{
    const response = await api.post(`/signup`,formData);
    console.log(response.data);
    return response.data;
}
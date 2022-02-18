
import axios from 'axios';

export function fetchUserDetails() {
    return (dispatch) => axios.get(`${process.env.REACT_APP_API_URL}/api/users/`)
        .then(({ data }) => {
            dispatch({ type: 'CREATE_USER', payload: data.data });
        });
}

export function postUser(data) {
    return axios.post(`${process.env.REACT_APP_API_URL}/api/users`, data)
}

export function updateUser(id, data) {
    return axios.put(`${process.env.REACT_APP_API_URL}/api/users/${id}`, data)
}

export function deleteUser(id) {
    return axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`)
}
import axios from 'axios';

const cruxAPI = (urls) => {
    return axios.post('http://localhost:5000/api/crux', { urls });
};

export default cruxAPI;

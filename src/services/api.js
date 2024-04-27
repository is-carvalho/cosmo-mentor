const axios = require("axios");

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,//"http://localhost:8080"
})

module.exports = {
    api: api,
};
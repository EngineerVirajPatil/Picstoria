const axios = require("axios");
require("dotenv").config();

console.log("Client Key:", process.env.UNSPLASH_ACCESS_KEY); 
console.log("Client Secret:", process.env.UNSPLASH_ACCESS_SECRET); 

const axiosInstance = axios.create({
    baseURL: process.env.MICROSERVICES_BASE_URL,
    headers: {
        "Content-Type":"application/json",
        CLIENT_KEY: process.env.UNSPLASH_ACCESS_KEY,
        CLIENT_SECRET: process.env.UNSPLASH_ACCESS_SECRET,
    },
});

module.exports = axiosInstance;

require("dotenv").config();
const express = require('express');
const app=express();
app.use(express.json());
const createNewUsers=require('./controllers/userController.js');
const {searchPhotos,savedPhotos}=require('./controllers/photoController.js');

app.post('/api/users',createNewUsers);
app.get('/api/photos/search',searchPhotos);
app.post('/api/photos',savedPhotos);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})

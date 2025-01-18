require("dotenv").config();
const express = require('express');
const app=express();
app.use(express.json());
const createNewUsers=require('./controllers/userController.js');
const {searchPhotos,savedPhotos, saveTags,searchPhotosByTags}=require('./controllers/photoController.js');
const searchHistoryById=require('./controllers/searchHistoryController.js');

app.post('/api/users',createNewUsers);
app.get('/api/photos/search',searchPhotos);
app.post('/api/photos',savedPhotos);
app.post('/api/photos/:photoId/tags',saveTags);
app.get('/api/photos/tag/search',searchPhotosByTags);
app.get('/api/search-history',searchHistoryById);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})

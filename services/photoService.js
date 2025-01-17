const axiosInstance = require('../lib/axios.js');
const PhotoImage = require('../models/photoImage.js');
require('dotenv').config();

const searchImages =async(query)=>{
    try{  
         if(!process.env.UNSPLASH_ACCESS_KEY){
             throw new Error('Unsplash Access Key is not present. Please configure the .env file and include Unsplash Access Key');
         }

        const response=await axiosInstance.get(`/search/photos`,{
            headers:{
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            },
            params:{
                query,
                per_page: 10, 
            },
        })
        return response.data.results;
    }
    catch(errors){
        throw errors;
    }
}

const savePhotos=async(imageUrl, description, altDescription, tags, userId )=>{
await PhotoImage.create({
    imageUrl:imageUrl,
    description:description,
    altDescription:altDescription,
    tags:tags,
    userId:userId,
 });
 
     return{
        'message': 'Photo saved successfully'
      };
}

module.exports={searchImages, savePhotos};
const axiosInstance = require('../lib/axios.js');
require('dotenv').config();

const {searchImages, savePhotos} = require("../services/photoService");

const searchPhotos=async(req, res)=>{
try{
    const query=req.query.query;
 
    if(!query){
        res.status(404).json({message:'search term is required'});
    }

    const photos=await searchImages(query);

    if(!photos&&photos.length===0){
        res.status(404).json({message:'No images found for the given query.'});
    }

    if(photos&&photos.length>0){
       res.status(200).json({photos:photos});
    }
}
catch(errors){
res.status(500).json({message:'Error in fetching Photos', errors:errors});
}
}

const savedPhotos=async(req, res)=>{
    try{
        const {imageUrl, description, altDescription, tags, userId}=req.body;

        if (!imageUrl.startsWith('<https://images.unsplash.com/>')) {
            return res.status(400).json({ message: 'Invalid image URL' });
        }
        console.log("1");
        if(tags&&tags.length>5){
          return res.status(400).json({message:'Tags are greater than 5 for selected photo'});
        }
        console.log("2");
        for(tag of tags){
           if(tag.length>20){
            return res.status(400).json({message:'Tag exceeded 20 characters in length'});
           }
        }
        console.log("3");
        const photoResponse=await savePhotos(imageUrl, description,  altDescription, tags, userId);
        console.log("4");
           res.status(201).json(photoResponse);
        
    }
    catch(errors){
    console.log(errors);
      res.status(500).json({error:errors});
    }
}

module.exports={searchPhotos, savedPhotos};
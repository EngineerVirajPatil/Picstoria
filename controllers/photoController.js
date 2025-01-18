const axiosInstance = require('../lib/axios.js');
require('dotenv').config();

const { searchImages, savePhotos, saveTagsByPhotoId, searchTags } = require("../services/photoService");

const searchPhotos = async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            res.status(404).json({ message: 'search term is required' });
        }

        const photos = await searchImages(query);

        if (!photos && photos.length === 0) {
            res.status(404).json({ message: 'No images found for the given query.' });
        }

        if (photos && photos.length > 0) {
            res.status(200).json({ photos: photos });
        }
    }
    catch (errors) {
        res.status(500).json({ message: 'Error in fetching Photos', errors: errors });
    }
}

const savedPhotos = async (req, res) => {
    try {
        const { imageUrl, description, altDescription, tags, userId } = req.body;

        if (!imageUrl.startsWith('<https://images.unsplash.com/>')) {
            return res.status(400).json({ message: 'Invalid image URL' });
        }
        if (tags && tags.length > 5) {
            return res.status(400).json({ message: 'Tags are greater than 5 for selected photo' });
        }
        for (tag of tags) {
            if (tag.length > 20) {
                return res.status(400).json({ message: 'Tag exceeded 20 characters in length' });
            }
        }
        const photoResponse = await savePhotos(imageUrl, description, altDescription, tags, userId);
        res.status(201).json(photoResponse);

    }
    catch (errors) {
        res.status(500).json({ error: errors });
    }
}


const saveTags = async (req, res) => {
    try {
        const photoId = parseInt(req.params.photoId);
        if (isNaN(photoId)) {
            return res.status(400).json({ error: "Invalid photoId provided." });
        }
        const tags = req.body.tags;
        if (!tags || !Array.isArray(tags)) {
            return res.status(400).json({ error: "Tags must be an array of non-empty strings." });
        }
        const tagsResponse = await saveTagsByPhotoId(tags, photoId);
        res.status(201).json(tagsResponse);
    }
    catch (errors) {
        res.status(500).json({ errors: errors.message });
    }
}


const searchPhotosByTags = async (req, res) => {
    try {
        const { userId, sort, tags } = req.query;
        if (!tags.length <= 1 && !typeof tags === "string") {
            res.status(400).json({ message: "Please provide single tag and proper tag" });
        }

        if (!sort.toUpperCase() === 'ASC' || !sort.toUpperCase() === 'DESC') {
            res.status(400).json({ message: "Please provide proper sorting order" });
        }

        if (sort.length === 0 || sort === null) {
            sort = 'ASC';
        }

        const tagsResponse = await searchTags(userId, tags, sort);

        res.status(200).json(tagsResponse);
    }
    catch (errors) {
        res.status(500).json({ error: "Error in Fetching", errors: errors.message });
    }
}

module.exports = { searchPhotos, savedPhotos, saveTags, searchPhotosByTags };
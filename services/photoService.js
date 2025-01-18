const axiosInstance = require('../lib/axios.js');
const PhotoImage = require('../models/photoImage.js');
const searchHistories = require('../models/searchHistory.js');
require('dotenv').config();
const { Op, fn, col, where } = require("sequelize");

const searchImages = async (query) => {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error('Unsplash Access Key is not present. Please configure the .env file and include Unsplash Access Key');
    }

    const response = await axiosInstance.get(`/search/photos`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query,
        per_page: 10,
      },
    })
    return response.data.results;
  }
  catch (errors) {
    throw errors;
  }
}

const savePhotos = async (imageUrl, description, altDescription, tags, userId) => {
  await PhotoImage.create({
    imageUrl: imageUrl,
    description: description,
    altDescription: altDescription,
    tags: tags,
    userId: userId,
  });

  return {
    'message': 'Photo saved successfully'
  };
}


const saveTagsByPhotoId = async (tags, photoId) => {
  const pic = await PhotoImage.findByPk(photoId);

  if (!pic) {
    throw new Error("Photo Not Found");
  }

  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string" || tag.trim() === "")) {
    throw new Error("Tags must be non-empty strings.");
  }

  const existingTags = pic.tags || [];
  const totalTagsCount = existingTags.length + tags.length;

  if (totalTagsCount > 5) {
    throw new Error("Each photo can have a maximum of 5 tags.");
  }

  const updatedTags = existingTags.concat(tags);

  pic.set({ tags: updatedTags });
  await pic.save();

  return {
    message: "Tags added successfully",
  };
}

const searchTags = async (userId, tags, sort) => {

  if (userId && sort && tags) {
    await searchHistories.create({
      query: tags,
      userId: userId,
    });
  }

  const historyResponse = await PhotoImage.findAll({
    where: {
      tags: {
        [Op.like]: `%\"${tags}\"%`,
      },
    },
    order: [["createdAt", sort.toUpperCase()]],
    attributes: ["imageUrl", "description", "tags"],
  });

  if (historyResponse.length === 0) {
    throw new Error("No Photos Found");
  }

  return { photos: historyResponse };
}

module.exports = { searchImages, savePhotos, saveTagsByPhotoId, searchTags };
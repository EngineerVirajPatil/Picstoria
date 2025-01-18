const axiosInstance = require('../lib/axios.js');
const searchHistoryByUserId = require('../services/searchHistoryService.js');
require('dotenv').config();

const searchHistoryById = async (req, res) => {

    try {
        const userId = parseInt(req.query.userId);
        if (!userId || !typeof userId === 'INTEGER' || userId === NaN) {
            return res.status(400).json({ message: "Provide proper User ID" });
        }

        const searchHistoryResponse = await searchHistoryByUserId(userId);

        if (searchHistoryResponse) {
            res.status(200).json(searchHistoryResponse);
        }

    }
    catch (errors) {
        res.status(500).json({ errors: errors.message });
    }

}

module.exports = searchHistoryById;
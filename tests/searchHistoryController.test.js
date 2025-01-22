const searchHistoryByUserId = require('../services/searchHistoryService');
const searchHistories = require('../models/searchHistory');

jest.mock('../models/searchHistory');

describe('searchHistoryByUserId Service', () => {
    it('should return search history if userId has history', async () => {
        const mockHistory = [
            { query: 'nature', timestamp: '2025-01-01T00:00:00Z' },
            { query: 'technology', timestamp: '2025-01-02T00:00:00Z' },
        ];

        searchHistories.findAll.mockResolvedValue(mockHistory);

        const result = await searchHistoryByUserId(1);

        expect(searchHistories.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
        expect(result).toEqual({
            searchHistory: [
                { query: 'nature', timestamp: '2025-01-01T00:00:00Z' },
                { query: 'technology', timestamp: '2025-01-02T00:00:00Z' },
            ],
        });
    });

    it('should throw an error if no history is found', async () => {
        searchHistories.findAll.mockResolvedValue([]);

        await expect(searchHistoryByUserId(1)).rejects.toThrow('No search History found for user ID: 1');
    });

    it('should throw an error if database call fails', async () => {
        searchHistories.findAll.mockRejectedValue(new Error('Database error'));

        await expect(searchHistoryByUserId(1)).rejects.toThrow('Database error');
    });
});

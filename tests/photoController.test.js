const { searchPhotos, savedPhotos, saveTags, searchPhotosByTags } = require('../controllers/photoController');
const { searchImages, savePhotos, saveTagsByPhotoId, searchTags } = require('../services/photoService');

// Mock the service functions
jest.mock('../services/photoService', () => ({
  searchImages: jest.fn(),
  savePhotos: jest.fn(),
  saveTagsByPhotoId: jest.fn(),
  searchTags: jest.fn(),
}));

describe('Photo Controller Tests', () => {
  describe('searchPhotos', () => {
    it('should return 404 if no query is provided', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await searchPhotos(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'search term is required' });
    });

    it('should return photos if found', async () => {
      const req = { query: { query: 'nature' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockPhotos = [{ id: 1, url: 'photo.jpg' }];
      searchImages.mockResolvedValue(mockPhotos);

      await searchPhotos(req, res);

      expect(searchImages).toHaveBeenCalledWith('nature');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ photos: mockPhotos });
    });
  });

  describe('savedPhotos', () => {
    it('should return 400 for invalid image URL', async () => {
      const req = { body: { imageUrl: 'invalid.jpg', tags: [] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await savedPhotos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid image URL' });
    });

    it('should save photo and return 201', async () => {
      const req = {
        body: {
          imageUrl: 'https://images.unsplash.com/photo.jpg',
          description: 'A beautiful image',
          altDescription: 'Image alt text',
          tags: ['tag1', 'tag2'],
          userId: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      savePhotos.mockResolvedValue({ message: 'Photo saved successfully' });

      await savedPhotos(req, res);

      expect(savePhotos).toHaveBeenCalledWith(
        'https://images.unsplash.com/photo.jpg',
        'A beautiful image',
        'Image alt text',
        ['tag1', 'tag2'],
        1
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Photo saved successfully' });
    });
  });
});

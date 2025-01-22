const request = require('supertest');
const app = require('../index'); 
const { PhotoImage, searchHistories } = require('../models'); 
const Users = require('../models/user');
const doesUserExist = require('../services/userService');

jest.mock('../models/user'); 
jest.mock('../services/userService'); 

jest.mock('../models/photoImage', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock('../models/searchHistory', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
}));


describe('API Integration Tests', () => {
  describe('GET /api/photos/search', () => {
    it('should return 404 if no query is provided', async () => {
      const response = await request(app).get('/api/photos/search');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'search term is required' });
    });

    it('should return photos if query is provided', async () => {
      const mockPhotos = [{ id: 1, url: 'photo.jpg' }];
      PhotoImage.findAll.mockResolvedValue(mockPhotos);

      const response = await request(app).get('/api/photos/search?query=nature');
      expect(response.status).toBe(200);
      expect(response.body.photos).toEqual(mockPhotos);
    });
  });

  describe('POST /api/photos', () => {
    it('should return 400 for invalid image URL', async () => {
      const response = await request(app)
        .post('/api/photos')
        .send({ imageUrl: 'invalid.jpg', tags: [] });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid image URL' });
    });

    it('should save a photo and return 201', async () => {
      PhotoImage.create.mockResolvedValue({ message: 'Photo saved successfully' });

      const response = await request(app)
        .post('/api/photos')
        .send({
          imageUrl: 'https://images.unsplash.com/photo.jpg',
          description: 'A beautiful image',
          altDescription: 'Image alt text',
          tags: ['tag1', 'tag2'],
          userId: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Photo saved successfully' });
    });
  });

  describe('GET /api/search-history', () => {
    it('should return 400 for invalid user ID', async () => {
      const response = await request(app).get('/api/search-history?userId=invalid');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Provide proper User ID' });
    });

    it('should return search history for a valid user ID', async () => {
      const mockHistory = [{ query: 'nature', timestamp: '2025-01-15T12:00:00Z' }];
      searchHistories.findAll.mockResolvedValue(mockHistory);

      const response = await request(app).get('/api/search-history?userId=1');
      expect(response.status).toBe(200);
      expect(response.body.searchHistory).toEqual(mockHistory);
    });
  });


  describe('POST /api/users - createNewUser', () => {
    test('should return validation errors if username and email are missing', async () => {
      const res = await request(app).post('/api/users').send({ username: '', email: '' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        errors: ['Username is required', 'Email is required'],
      });
    });

    test('should return a validation error if only username is missing', async () => {
      const res = await request(app).post('/api/users').send({ username: '', email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        errors: ['Username is required'],
      });
    });

    test('should return a validation error if only email is missing', async () => {
      const res = await request(app).post('/api/users').send({ username: 'testuser', email: '' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        errors: ['Email is required'],
      });
    });

    test('should return success if email already exists', async () => {
      doesUserExist.mockResolvedValue(true); 

      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', email: 'existing@example.com' });

      expect(doesUserExist).toHaveBeenCalledWith('existing@example.com');
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: 'User created successfully',
        user: { username: 'testuser', email: 'existing@example.com' },
      });
    });

    test('should create a new user if email does not exist', async () => {
      doesUserExist.mockResolvedValue(false); 
      Users.create.mockResolvedValue({}); 

      const res = await request(app)
        .post('/api/users')
        .send({ username: 'newuser', email: 'new@example.com' });

      expect(doesUserExist).toHaveBeenCalledWith('new@example.com');
      expect(Users.create).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@example.com',
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: 'User created successfully',
        user: { username: 'newuser', email: 'new@example.com' },
      });
    });

    test('should return 500 if an error occurs during user creation', async () => {
      doesUserExist.mockResolvedValue(false); 
      Users.create.mockRejectedValue(new Error('Database error')); 

      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', email: 'test@example.com' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Error in creating User',
        details: 'Database error',
      });
    });
  });

  describe('GET /api/users/:email - doesUserExist', () => {
    test('should return user details if email exists', async () => {
      Users.findOne.mockResolvedValue({ email: 'test@example.com', username: 'testuser' }); 

      const res = await request(app).get('/api/users/test@example.com');

      expect(Users.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        email: 'test@example.com',
        username: 'testuser',
      });
    });

    test('should return 404 if email does not exist', async () => {
      Users.findOne.mockResolvedValue(null);

      const res = await request(app).get('/api/users/nonexistent@example.com');

      expect(Users.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });
  });



});



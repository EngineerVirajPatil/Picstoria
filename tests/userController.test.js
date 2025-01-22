const { validateUser } = require('../path-to-createNewUser-file');
const createNewUser = require('../path-to-createNewUser-file');
const doesUserExist = require('../services/userService');
const Users = require('../models/user');

jest.mock('../services/userService');
jest.mock('../models/user');

describe('validateUser function', () => {
  test('should return an error if username and email are missing', () => {
    const errors = validateUser('', '');
    expect(errors).toEqual(['Username is required', 'Email is required']);
  });

  test('should return an error if username is missing', () => {
    const errors = validateUser('', 'test@example.com');
    expect(errors).toEqual(['Username is required']);
  });

  test('should return an error if email is missing', () => {
    const errors = validateUser('testuser', '');
    expect(errors).toEqual(['Email is required']);
  });

  test('should return no errors if username and email are provided', () => {
    const errors = validateUser('testuser', 'test@example.com');
    expect(errors).toEqual([]);
  });
});


describe('createNewUser function', () => {
    let req, res;
  
    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    test('should return validation errors if username and email are missing', async () => {
      req.body = { username: '', email: '' };
  
      await createNewUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Username is required', 'Email is required'],
      });
    });
  
    test('should not create user if email already exists', async () => {
      req.body = { username: 'testuser', email: 'test@example.com' };
      doesUserExist.mockResolvedValue(true);
  
      await createNewUser(req, res);
  
      expect(doesUserExist).toHaveBeenCalledWith('test@example.com');
      expect(Users.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: { username: 'testuser', email: 'test@example.com' },
      });
    });
  
    test('should create a new user if email does not exist', async () => {
      req.body = { username: 'testuser', email: 'test@example.com' };
      doesUserExist.mockResolvedValue(false);
      Users.create.mockResolvedValue({});
  
      await createNewUser(req, res);
  
      expect(doesUserExist).toHaveBeenCalledWith('test@example.com');
      expect(Users.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: { username: 'testuser', email: 'test@example.com' },
      });
    });
  
    test('should return 500 if an error occurs during user creation', async () => {
      req.body = { username: 'testuser', email: 'test@example.com' };
      doesUserExist.mockResolvedValue(false);
      Users.create.mockRejectedValue(new Error('Database error'));
  
      await createNewUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error in creating User',
        details: 'Database error',
      });
    });
  });

  describe('doesUserExist function', () => {
    test('should return user if email exists', async () => {
      user.findOne.mockResolvedValue({ email: 'test@example.com' });
  
      const result = await doesUserExist('test@example.com');
      expect(user.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual({ email: 'test@example.com' });
    });
  
    test('should return null if email does not exist', async () => {
      user.findOne.mockResolvedValue(null);
  
      const result = await doesUserExist('nonexistent@example.com');
      expect(user.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(result).toBeNull();
    });
  });
import { agent } from '../setup';
import prisma from '../../app/config/prisma';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await prisma.customer.deleteMany({
      where: {
        email: 'test@example.com'
      }
    });
  });

  afterAll(async () => {
    await prisma.customer.deleteMany({
      where: {
        email: 'test@example.com'
      }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        birthDate: '1990-01-01'
      };

      const response = await agent
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteUserData = {
        email: 'incomplete@example.com',
        password: 'password123'
      };

      const response = await agent
        .post('/api/auth/register')
        .send(incompleteUserData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        birthDate: '1990-01-01'
      };

      const response = await agent
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await agent
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', loginData.email);
    });

    it('should return 400 if email or password is missing', async () => {
      const incompleteLoginData = {
        email: 'test@example.com'
      };

      const response = await agent
        .post('/api/auth/login')
        .send(incompleteLoginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 for invalid credentials', async () => {
      const invalidLoginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await agent
        .post('/api/auth/login')
        .send(invalidLoginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/dashboard', () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await agent
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      authToken = loginResponse.body.token;
    });

    it('should return dashboard data for authenticated user', async () => {
      const response = await agent
        .get('/api/auth/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('dashboardStats');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await agent
        .get('/api/auth/dashboard');

      expect(response.status).toBe(401);
    });

    it('should return 401 if invalid token is provided', async () => {
      const response = await agent
        .get('/api/auth/dashboard')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });
  });
});
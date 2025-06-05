import { agent } from '../setup';
import prisma from '../../app/config/prisma';

describe('Customer Routes', () => {
  let authToken: string;
  let testCustomerId: string;

  beforeAll(async () => {
    const registerResponse = await agent
      .post('/api/auth/register')
      .send({
        email: 'customer-test@example.com',
        password: 'password123',
        name: 'Customer Test',
        birthDate: '1990-01-01'
      });

    authToken = registerResponse.body.token;
    testCustomerId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    await prisma.customer.deleteMany({
      where: {
        email: 'customer-test@example.com'
      }
    });
    await prisma.$disconnect();
  });

  describe('GET /api/customers', () => {
    it('should return all customers for authenticated user', async () => {
      const response = await agent
        .get('/api/customers')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('customers');
      expect(Array.isArray(response.body.data.customers)).toBe(true);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await agent
        .get('/api/customers');

      expect(response.status).toBe(401);
    }, 10000);

    it('should return 404 for non-existent customer ID', async () => {
      const nonExistentId = 'non-existent-id';
      const response = await agent
        .get(`/api/customers/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
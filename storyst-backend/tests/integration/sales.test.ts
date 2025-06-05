import { agent } from '../setup';
import prisma from '../../app/config/prisma';

describe('Sale Routes', () => {
  let authToken: string;
  let testCustomerId: string;

  beforeAll(async () => {
    const registerResponse = await agent
      .post('/api/auth/register')
      .send({
        email: 'sales-test@example.com',
        password: 'password123',
        name: 'Sales Test User',
        birthDate: '1990-01-01'
      });

    authToken = registerResponse.body.token;
    testCustomerId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    await prisma.sale.deleteMany({
      where: {
        customer_id: testCustomerId
      }
    });
    
    await prisma.customer.deleteMany({
      where: {
        email: 'sales-test@example.com'
      }
    });
    
    await prisma.$disconnect();
  });

  describe('POST /api/sales', () => {
    it('should create a new sale successfully', async () => {
      const saleData = {
        value: 150.75,
        sale_date: '2023-05-15'
      };

      const response = await agent
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send(saleData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'Venda registrada com sucesso.');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('sale');
      expect(response.body.data.sale).toHaveProperty('id');
      expect(response.body.data.sale).toHaveProperty('value', 150.75);
      expect(response.body.data.sale).toHaveProperty('sale_date');
      expect(response.body.data.sale).toHaveProperty('customer_id', testCustomerId);
    });

    it('should create a sale with current date when sale_date is not provided', async () => {
      const saleData = {
        value: 200.50
      };

      const response = await agent
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send(saleData);

      expect(response.status).toBe(201);
      expect(response.body.data.sale).toHaveProperty('value', 200.50);
      expect(response.body.data.sale).toHaveProperty('sale_date');
    });

    it('should return 400 if value is not provided', async () => {
      const invalidSaleData = {
        sale_date: '2023-05-15'
      };

      const response = await agent
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidSaleData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if value is negative', async () => {
      const invalidSaleData = {
        value: -50,
        sale_date: '2023-05-15'
      };

      const response = await agent
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidSaleData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if sale_date has invalid format', async () => {
      const invalidSaleData = {
        value: 100,
        sale_date: '15/05/2023'
      };

      const response = await agent
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidSaleData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 if no token is provided', async () => {
      const saleData = {
        value: 150.75,
        sale_date: '2023-05-15'
      };

      const response = await agent
        .post('/api/sales')
        .send(saleData);

      expect(response.status).toBe(401);
    });
  });
});
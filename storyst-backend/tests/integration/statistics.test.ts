import { agent } from '../setup';
import prisma from '../../app/config/prisma';

describe('Statistics Routes', () => {
  let authToken: string;
  let testCustomerId: string;
  let secondAuthToken: string;
  let secondCustomerId: string;

  beforeAll(async () => {
    await prisma.sale.deleteMany({
      where: {
        customer: {
          email: {
            in: ['stats-test1@example.com', 'stats-test2@example.com']
          }
        }
      }
    });
    
    await prisma.customer.deleteMany({
      where: {
        email: {
          in: ['stats-test1@example.com', 'stats-test2@example.com']
        }
      }
    });

    const firstUserResponse = await agent
      .post('/api/auth/register')
      .send({
        email: 'stats-test1@example.com',
        password: 'password123',
        name: 'Stats Test User 1',
        birthDate: '1990-01-01'
      });

    if (!firstUserResponse.body.user || !firstUserResponse.body.user.id) {
      throw new Error(`Failed to register test user: ${JSON.stringify(firstUserResponse.body)}`);
    }

    authToken = firstUserResponse.body.token;
    testCustomerId = firstUserResponse.body.user.id;

    const secondUserResponse = await agent
      .post('/api/auth/register')
      .send({
        email: 'stats-test2@example.com',
        password: 'password123',
        name: 'Stats Test User 2',
        birthDate: '1992-02-02'
      });

    secondAuthToken = secondUserResponse.body.token;
    secondCustomerId = secondUserResponse.body.user.id;

    await prisma.sale.createMany({
      data: [
        {
          customer_id: testCustomerId,
          sale_date: new Date('2023-05-01'),
          value: 100.50,
          created_at: new Date()
        },
        {
          customer_id: testCustomerId,
          sale_date: new Date('2023-05-02'),
          value: 200.75,
          created_at: new Date()
        },
        {
          customer_id: testCustomerId,
          sale_date: new Date('2023-05-03'),
          value: 150.25,
          created_at: new Date()
        }
      ]
    });

    await prisma.sale.createMany({
      data: [
        {
          customer_id: secondCustomerId,
          sale_date: new Date('2023-05-01'),
          value: 300.00,
          created_at: new Date()
        },
        {
          customer_id: secondCustomerId,
          sale_date: new Date('2023-05-02'),
          value: 450.50,
          created_at: new Date()
        },
        {
          customer_id: secondCustomerId,
          sale_date: new Date('2023-05-03'),
          value: 500.25,
          created_at: new Date()
        },
        {
          customer_id: secondCustomerId,
          sale_date: new Date('2023-05-04'),
          value: 600.75,
          created_at: new Date()
        }
      ]
    });
  });

  afterAll(async () => {
    await prisma.sale.deleteMany({
      where: {
        customer_id: {
          in: [testCustomerId, secondCustomerId]
        }
      }
    });
    
    await prisma.customer.deleteMany({
      where: {
        email: {
          in: ['stats-test1@example.com', 'stats-test2@example.com']
        }
      }
    });
    
    await prisma.$disconnect();
  });

  describe('GET /api/sales/statistics/daily', () => {
    it('should return daily sales statistics for authenticated user', async () => {
      const response = await agent
        .get('/api/sales/statistics/daily')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('statistics');
      expect(Array.isArray(response.body.data.statistics)).toBe(true);
      expect(response.body.data.statistics.length).toBe(3);
      
      const firstStat = response.body.data.statistics[0];
      expect(firstStat).toHaveProperty('date');
      expect(firstStat).toHaveProperty('totalSales');
      
      const totalSales = response.body.data.statistics.reduce(
        (sum: number, stat: any) => sum + stat.totalSales, 0
      );
      expect(totalSales).toBeCloseTo(451.5);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await agent
        .get('/api/sales/statistics/daily');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sales/statistics/top-volume-customer', () => {
    it('should return the customer with highest sales volume', async () => {
      const topVolumeCustomer = await prisma.sale.groupBy({
        by: ["customer_id"],
        _sum: {
          value: true,
        },
        orderBy: {
          _sum: {
            value: "desc",
          },
        },
        take: 1,
      });
  
      const expectedCustomerId = topVolumeCustomer[0].customer_id;
      const expectedTotalVolume = topVolumeCustomer[0]._sum.value?.toNumber() || 0;
  
      const response = await agent
        .get('/api/sales/statistics/top-volume-customer')
        .set('Authorization', `Bearer ${authToken}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('topCustomer');
      expect(response.body.data.topCustomer).toHaveProperty('customer');
      expect(response.body.data.topCustomer).toHaveProperty('totalSalesVolume');
      
      expect(response.body.data.topCustomer.customer.id).toBe(expectedCustomerId);
      expect(response.body.data.topCustomer.totalSalesVolume).toBeCloseTo(expectedTotalVolume);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await agent
        .get('/api/sales/statistics/top-volume-customer');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sales/statistics/top-avg-value-customer', () => {
    it('should return the customer with highest average sale value', async () => {
      const customersWithAvg = await prisma.sale.groupBy({
        by: ["customer_id"],
        _avg: {
          value: true,
        },
        orderBy: {
          _avg: {
            value: "desc",
          },
        },
        take: 1,
        having: {
          customer_id: {
            _count: {
              gt: 0,
            },
          },
        },
      });
  
      const expectedCustomerId = customersWithAvg[0].customer_id;
      const expectedAvgValue = customersWithAvg[0]._avg.value?.toNumber() || 0;
  
      const response = await agent
        .get('/api/sales/statistics/top-avg-value-customer')
        .set('Authorization', `Bearer ${authToken}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('topCustomer');
      expect(response.body.data.topCustomer).toHaveProperty('customer');
      expect(response.body.data.topCustomer).toHaveProperty('averageSaleValue');
      
      expect(response.body.data.topCustomer.customer.id).toBe(expectedCustomerId);
      expect(response.body.data.topCustomer.averageSaleValue).toBeCloseTo(expectedAvgValue);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await agent
        .get('/api/sales/statistics/top-avg-value-customer');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sales/statistics/top-frequency-customer', () => {
    it('should return the customer with highest purchase frequency', async () => {
      const customersWithFrequency = await prisma.sale.groupBy({
        by: ["customer_id"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 1,
      });
  
      const expectedCustomerId = customersWithFrequency[0].customer_id;
      const expectedPurchaseCount = customersWithFrequency[0]._count.id || 0;
  
      const response = await agent
        .get('/api/sales/statistics/top-frequency-customer')
        .set('Authorization', `Bearer ${authToken}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('topCustomer');
      expect(response.body.data.topCustomer).toHaveProperty('customer');
      expect(response.body.data.topCustomer).toHaveProperty('purchaseCount');
      
      expect(response.body.data.topCustomer.customer.id).toBe(expectedCustomerId);
      expect(response.body.data.topCustomer.purchaseCount).toBe(expectedPurchaseCount);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await agent
        .get('/api/sales/statistics/top-frequency-customer');

      expect(response.status).toBe(401);
    });
  });
});
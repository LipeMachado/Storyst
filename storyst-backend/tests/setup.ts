import dotenv from 'dotenv';
import prisma from '../app/config/prisma';
import app from '../app/app';
import http from 'http';
import supertest from 'supertest';

dotenv.config({ path: '.env.test' });

let server: http.Server;
export let agent: ReturnType<typeof supertest.agent>;

global.beforeAll(async () => {
  console.log('Iniciando testes...');
  try {
    await prisma.$connect();
    console.log('Conectado ao banco de dados de teste');
    
    server = app.listen(0);
    agent = supertest.agent(server);
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
});

global.afterAll(async () => {
  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('Server closed');
          resolve();
        });
      });
    }
    
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});
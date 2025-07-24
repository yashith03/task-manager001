// tests/integration.test.js (conditional version)

const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../server');

// Only run integration tests if database is available
const shouldRunIntegrationTests = process.env.RUN_INTEGRATION_TESTS === 'true';

const conditionalDescribe = shouldRunIntegrationTests ? describe : describe.skip;

// Use a separate test database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || 'postgresql://postgres:postgres@localhost:5432/taskmanager_test'
    }
  }
});

conditionalDescribe('Integration Tests (Real DB)', () => {
  beforeAll(async () => {
    try {
      // Test database connection first
      await prisma.$connect();
      await prisma.task.deleteMany();
    } catch (error) {
      console.log('Database not available, skipping integration tests');
      return;
    }
  });

  beforeEach(async () => {
    // Clean slate for each test
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    try {
      await prisma.task.deleteMany();
      await prisma.$disconnect();
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should create and retrieve a task', async () => {
    // Create task
    const createRes = await request(app)
      .post('/api/tasks')
      .send({ text: 'Integration test task', priority: 'High' });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.text).toBe('Integration test task');

    // Retrieve tasks
    const getRes = await request(app).get('/api/tasks');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveLength(1);
    expect(getRes.body[0].text).toBe('Integration test task');
  });

  it('should update a task', async () => {
    // Create task first
    const task = await prisma.task.create({
      data: { text: 'Original task', priority: 'Low' }
    });

    // Update task
    const updateRes = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ text: 'Updated task', priority: 'High' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.text).toBe('Updated task');
    expect(updateRes.body.priority).toBe('High');
  });

  it('should delete a task', async () => {
    // Create task first
    const task = await prisma.task.create({
      data: { text: 'Task to delete' }
    });

    // Delete task
    const deleteRes = await request(app).delete(`/api/tasks/${task.id}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.msg).toBe('Task deleted successfully');

    // Verify deletion
    const getRes = await request(app).get('/api/tasks');
    expect(getRes.body).toHaveLength(0);
  });

  it('should toggle task completion', async () => {
    // Create task first
    const task = await prisma.task.create({
      data: { text: 'Task to toggle', completed: false }
    });

    // Toggle completion
    const toggleRes = await request(app).patch(`/api/tasks/${task.id}/toggle`);
    expect(toggleRes.statusCode).toBe(200);
    expect(toggleRes.body.completed).toBe(true);

    // Toggle back
    const toggleBackRes = await request(app).patch(`/api/tasks/${task.id}/toggle`);
    expect(toggleBackRes.statusCode).toBe(200);
    expect(toggleBackRes.body.completed).toBe(false);
  });
});
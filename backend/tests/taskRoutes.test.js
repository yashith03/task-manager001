// tests/taskRoutes.test.js

// Set test environment
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server'); // server.js must export app

// Mock prisma for all tests
jest.mock('../prisma', () => ({
  task: {
    deleteMany: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
}));

const prisma = require('../prisma');

describe('🧪 Task API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ✅ CREATE TASK
  it('POST /api/tasks - should create a new task', async () => {
    const mockTask = {
      id: 'test-id',
      text: 'Write unit tests',
      priority: 'High',
      dueDate: '2025-12-31',
      tags: ['test', 'backend'],
      completed: false
    };

    prisma.task.create.mockResolvedValue(mockTask);

    const res = await request(app).post('/api/tasks').send({
      text: 'Write unit tests',
      priority: 'High',
      dueDate: '2025-12-31',
      tags: ['test', 'backend']
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.text).toBe('Write unit tests');
  });

  it('POST /api/tasks - should return 400 for missing text', async () => {
    const res = await request(app).post('/api/tasks').send({ priority: 'High' });
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Task text is required');
  });

  it('POST /api/tasks - should ignore "completed" if sent from frontend', async () => {
    const mockTask = {
      id: 'test-id',
      text: 'Override check',
      completed: false
    };

    prisma.task.create.mockResolvedValue(mockTask);

    const res = await request(app).post('/api/tasks').send({
      text: 'Override check',
      completed: true
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.completed).toBe(false); // backend enforces false
  });

  // ✅ READ TASKS
  it('GET /api/tasks - should return task list', async () => {
    const mockTasks = [{ id: 'test-id', text: 'Test GET', priority: 'Low' }];
    prisma.task.findMany.mockResolvedValue(mockTasks);

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ✅ TOGGLE COMPLETION
  it('PATCH /api/tasks/:id/toggle - should toggle completion', async () => {
    const mockTask = { id: 'test-id', text: 'Toggle me', completed: false };
    const updatedTask = { id: 'test-id', text: 'Toggle me', completed: true };

    prisma.task.findUnique.mockResolvedValue(mockTask);
    prisma.task.update.mockResolvedValue(updatedTask);

    const res = await request(app).patch(`/api/tasks/test-id/toggle`);
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('PATCH /api/tasks/:id/toggle - should return 404 for non-existent task', async () => {
    prisma.task.findUnique.mockResolvedValue(null);

    const res = await request(app).patch('/api/tasks/nonexistentid/toggle');
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe('Task not found');
  });

  // ✅ UPDATE TASK
  it('PUT /api/tasks/:id - should update a task', async () => {
    const mockTask = { id: 'test-id', text: 'Old', priority: 'Medium' };
    const updatedTask = { id: 'test-id', text: 'Updated', priority: 'Low' };

    prisma.task.findUnique.mockResolvedValue(mockTask);
    prisma.task.update.mockResolvedValue(updatedTask);

    const res = await request(app).put(`/api/tasks/test-id`).send({
      text: 'Updated',
      priority: 'Low'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Updated');
    expect(res.body.priority).toBe('Low');
  });

  it('PUT /api/tasks/:id - should return 404 for non-existent task', async () => {
    prisma.task.findUnique.mockResolvedValue(null);

    const res = await request(app).put('/api/tasks/nonexistentid').send({ text: 'New text' });
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe('Task not found');
  });

  it('PUT /api/tasks/:id - should ignore undefined fields', async () => {
    const mockTask = { id: 'test-id', text: 'Initial Task', priority: 'Medium' };
    const updatedTask = { id: 'test-id', text: 'Initial Task', priority: 'High' };

    prisma.task.findUnique.mockResolvedValue(mockTask);
    prisma.task.update.mockResolvedValue(updatedTask);

    const res = await request(app).put(`/api/tasks/test-id`).send({
      text: undefined,
      priority: 'High'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.priority).toBe('High');
  });

  // ✅ DELETE TASK
  it('DELETE /api/tasks/:id - should delete a task', async () => {
    prisma.task.delete.mockResolvedValue({ id: 'test-id' });

    const res = await request(app).delete(`/api/tasks/test-id`);
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe('Task deleted successfully');
  });

  it('DELETE /api/tasks/:id - should return 404 for non-existent task', async () => {
    const mockError = new Error('Record not found');
    mockError.code = 'P2025';
    prisma.task.delete.mockRejectedValue(mockError);

    const res = await request(app).delete('/api/tasks/nonexistentid');
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe('Task not found');
  });

  it('should return 500 on DB error', async () => {
    prisma.task.create.mockRejectedValue(new Error('DB error'));

    const res = await request(app).post('/api/tasks').send({ text: 'Error task' });

    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe('Server error');
  });

  // ✅ EXTRA TESTS
  it('should return 400 for missing task text', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Task text is required');
  });

  it('should create a task with full payload', async () => {
    const mockTask = {
      id: 'test-id',
      text: 'Write integration tests',
      priority: 'High',
      dueDate: '2025-08-01',
      tags: ['backend', 'important'],
      completed: false
    };

    prisma.task.create.mockResolvedValue(mockTask);

    const res = await request(app).post('/api/tasks').send({
      text: 'Write integration tests',
      priority: 'High',
      dueDate: '2025-08-01',
      tags: ['backend', 'important']
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Write integration tests');
    expect(res.body.priority).toBe('High');
    expect(res.body.tags).toContain('backend');
  });

  it('POST /api/tasks - should return 400 if task text is missing', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Task text is required');
  });

  it('POST /api/tasks - should return 500 on DB error', async () => {
    prisma.task.create.mockRejectedValue(new Error('Simulated DB failure'));

    const res = await request(app).post('/api/tasks').send({ text: 'Test' });
    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe('Server error');
  });

  it('PUT /api/tasks/:id - should return 404 if task not found', async () => {
    prisma.task.findUnique.mockResolvedValue(null);

    const res = await request(app).put(`/api/tasks/nonexistent-id`).send({ text: 'Updated' });
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe('Task not found');
  });

  it('PUT /api/tasks/:id - should ignore undefined fields in update', async () => {
    const mockTask = { id: 'test-id', text: 'Sanitize update test', priority: 'Medium' };
    const updatedTask = { id: 'test-id', text: 'Sanitize update test', priority: 'Low' };

    prisma.task.findUnique.mockResolvedValue(mockTask);
    prisma.task.update.mockResolvedValue(updatedTask);

    const res = await request(app)
      .put(`/api/tasks/test-id`)
      .send({ text: undefined, priority: 'Low' });

    expect(res.statusCode).toBe(200);
    expect(res.body.priority).toBe('Low');
    expect(res.body.text).toBe('Sanitize update test'); // unchanged
  });

  it('PUT /api/tasks/:id - should return 500 on DB error', async () => {
    const mockTask = { id: 'test-id', text: 'Error test' };
    prisma.task.findUnique.mockResolvedValue(mockTask);
    prisma.task.update.mockRejectedValue(new Error('Simulated DB failure'));

    const res = await request(app).put(`/api/tasks/test-id`).send({ text: 'New text' });
    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe('Server error');
  });
});
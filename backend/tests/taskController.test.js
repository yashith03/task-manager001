const request = require('supertest');
const app = require('../server'); // Your Express app
const prisma = require('../prisma'); // Prisma client

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

//
// GET /api/tasks
//
it('GET /api/tasks - should return 500 on DB error', async () => {
  const originalFindMany = prisma.task.findMany;
  prisma.task.findMany = jest.fn().mockRejectedValue(new Error('Simulated DB error'));

  const res = await request(app).get('/api/tasks');
  expect(res.statusCode).toBe(500);
  expect(res.body.msg).toBe('Server error');

  prisma.task.findMany = originalFindMany;
});

//
// POST /api/tasks
//
it('POST /api/tasks - should return 400 if task text is missing', async () => {
  const res = await request(app).post('/api/tasks').send({});
  expect(res.statusCode).toBe(400);
  expect(res.body.msg).toBe('Task text is required');
});

it('POST /api/tasks - should return 500 on DB error', async () => {
  const originalCreate = prisma.task.create;
  prisma.task.create = jest.fn().mockRejectedValue(new Error('Simulated DB failure'));

  const res = await request(app).post('/api/tasks').send({ text: 'Error task' });
  expect(res.statusCode).toBe(500);
  expect(res.body.msg).toBe('Server error');

  prisma.task.create = originalCreate;
});

//
// PUT /api/tasks/:id
//
it('PUT /api/tasks/:id - should return 404 if task does not exist', async () => {
  const originalFindUnique = prisma.task.findUnique;
  prisma.task.findUnique = jest.fn().mockResolvedValue(null);

  const fakeId = 'nonexistent123';
  const res = await request(app)
    .put(`/api/tasks/${fakeId}`)
    .send({ text: 'Update attempt' });

  expect(res.statusCode).toBe(404);
  expect(res.body.msg).toBe('Task not found');

  prisma.task.findUnique = originalFindUnique;
});

it('PUT /api/tasks/:id - should update task successfully', async () => {
  const mockTask = { id: 'test-id', text: 'To be updated' };
  const updatedTask = { id: 'test-id', text: 'Updated!' };

  const originalFindUnique = prisma.task.findUnique;
  const originalUpdate = prisma.task.update;

  prisma.task.findUnique = jest.fn().mockResolvedValue(mockTask);
  prisma.task.update = jest.fn().mockResolvedValue(updatedTask);

  const res = await request(app)
    .put(`/api/tasks/test-id`)
    .send({ text: 'Updated!' });

  expect(res.statusCode).toBe(200);
  expect(res.body.text).toBe('Updated!');

  prisma.task.findUnique = originalFindUnique;
  prisma.task.update = originalUpdate;
});

//
// PATCH /api/tasks/:id/toggle
//
it('PATCH /api/tasks/:id/toggle - should return 500 on DB error', async () => {
  const mockTask = { id: 'test-id', text: 'Toggle DB fail test', completed: false };

  const originalFindUnique = prisma.task.findUnique;
  const originalUpdate = prisma.task.update;

  prisma.task.findUnique = jest.fn().mockResolvedValue(mockTask);
  prisma.task.update = jest.fn().mockRejectedValue(new Error('Simulated DB failure'));

  const res = await request(app).patch(`/api/tasks/test-id/toggle`);
  expect(res.statusCode).toBe(500);
  expect(res.body.msg).toBe('Server error');

  prisma.task.findUnique = originalFindUnique;
  prisma.task.update = originalUpdate;
});

//
// DELETE /api/tasks/:id
//
it('DELETE /api/tasks/:id - should return 404 when task not found', async () => {
  const originalDelete = prisma.task.delete;
  const mockError = new Error('Record not found');
  mockError.code = 'P2025';
  prisma.task.delete = jest.fn().mockRejectedValue(mockError);

  const fakeId = 'clxyz1234567890';
  const res = await request(app).delete(`/api/tasks/${fakeId}`);

  expect(res.statusCode).toBe(404);
  expect(res.body.msg).toBe('Task not found');

  prisma.task.delete = originalDelete;
});

it('DELETE /api/tasks/:id - should return 500 on unknown DB error', async () => {
  const originalDelete = prisma.task.delete;
  const mockError = new Error('Unexpected error');
  mockError.code = 'UNKNOWN';
  prisma.task.delete = jest.fn().mockRejectedValue(mockError);

  const res = await request(app).delete('/api/tasks/some-id');
  expect(res.statusCode).toBe(500);
  expect(res.body.msg).toBe('Server error');

  prisma.task.delete = originalDelete;
});
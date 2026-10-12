/**
 * TaskFlow Backend Tests
 * Uses Jest + Supertest with an in-memory MongoDB via mongodb-memory-server.
 *
 * NOTE: These tests use a separate in-memory database so they NEVER touch
 * your production or development MongoDB Atlas database.
 */

// Increase mongodb-memory-server's own instance-start timeout.
// Must be set BEFORE the module is imported.
process.env.MONGOMS_INSTANCE_START_TIMEOUT = '60000';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// ─────────────────────────────────────────────
// Increase global timeout — mongodb-memory-server
// downloads a MongoDB binary on first run (~100 MB)
// and needs more than the default 5 000 ms.
// ─────────────────────────────────────────────
jest.setTimeout(120_000);

let app;
let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Override MONGODB_URI before requiring app (which calls connectDB)
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = 'test';

  // Connect mongoose
  await mongoose.connect(uri);

  // Import app AFTER mongoose is connected
  app = require('../server');
}, 120_000); // explicit hook timeout

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 30_000);

afterEach(async () => {
  // Clean up all tasks between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});


// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
describe('GET /api/health', () => {
  it('should return 200 and API health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/running/i);
  });
});

// ─────────────────────────────────────────────
// Create Task
// ─────────────────────────────────────────────
describe('POST /api/tasks', () => {
  it('should create a task with valid data', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Test Task',
      description: 'A test description',
      priority: 'High',
      status: 'Pending',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test Task');
    expect(res.body.data.priority).toBe('High');
  });

  it('should reject a task with no title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title here' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject a task with empty title string', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '   ' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid priority value', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Bad Priority Task',
      priority: 'Critical',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid status value', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Bad Status Task',
      status: 'InProgress',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should use defaults for priority and status', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Default Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.priority).toBe('Medium');
    expect(res.body.data.status).toBe('Pending');
  });

  it('should accept a valid dueDate', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Task with due date',
      dueDate: '2025-12-31',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.dueDate).toBeTruthy();
  });

  it('should reject an invalid dueDate', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Bad date task',
      dueDate: 'not-a-date',
    });
    expect(res.statusCode).toBe(400);
  });
});

// ─────────────────────────────────────────────
// Get All Tasks
// ─────────────────────────────────────────────
describe('GET /api/tasks', () => {
  it('should return an empty list initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.total).toBe(0);
  });

  it('should return tasks after creation', async () => {
    await request(app).post('/api/tasks').send({ title: 'Task A' });
    await request(app).post('/api/tasks').send({ title: 'Task B' });
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.total).toBe(2);
  });

  it('should filter tasks by status', async () => {
    await request(app).post('/api/tasks').send({ title: 'Pending Task', status: 'Pending' });
    await request(app).post('/api/tasks').send({ title: 'Done Task', status: 'Completed' });
    const res = await request(app).get('/api/tasks?status=Completed');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe('Completed');
  });

  it('should filter tasks by priority', async () => {
    await request(app).post('/api/tasks').send({ title: 'High Task', priority: 'High' });
    await request(app).post('/api/tasks').send({ title: 'Low Task', priority: 'Low' });
    const res = await request(app).get('/api/tasks?priority=High');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].priority).toBe('High');
  });

  it('should search tasks by title', async () => {
    await request(app).post('/api/tasks').send({ title: 'Buy groceries' });
    await request(app).post('/api/tasks').send({ title: 'Write report' });
    const res = await request(app).get('/api/tasks?search=groceries');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Buy groceries');
  });
});

// ─────────────────────────────────────────────
// Get Task by ID
// ─────────────────────────────────────────────
describe('GET /api/tasks/:id', () => {
  it('should return a task by valid ID', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'Findable Task' });
    const id = create.body.data._id;
    const res = await request(app).get(`/api/tasks/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(id);
    expect(res.body.data.title).toBe('Findable Task');
  });

  it('should return 404 for non-existent task', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/tasks/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/tasks/not-a-valid-id');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────
// Update Task
// ─────────────────────────────────────────────
describe('PUT /api/tasks/:id', () => {
  it('should update a task successfully', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'Original Title' });
    const id = create.body.data._id;
    const res = await request(app).put(`/api/tasks/${id}`).send({
      title: 'Updated Title',
      priority: 'High',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
    expect(res.body.data.priority).toBe('High');
  });

  it('should return 404 for non-existent task', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/tasks/${fakeId}`).send({ title: 'Ghost Task' });
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid ID', async () => {
    const res = await request(app).put('/api/tasks/bad-id').send({ title: 'Test' });
    expect(res.statusCode).toBe(400);
  });
});

// ─────────────────────────────────────────────
// Update Task Status
// ─────────────────────────────────────────────
describe('PATCH /api/tasks/:id/status', () => {
  it('should update task status to Completed', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'Mark me done' });
    const id = create.body.data._id;
    const res = await request(app).patch(`/api/tasks/${id}/status`).send({ status: 'Completed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('Completed');
  });

  it('should reject invalid status value', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'Status test' });
    const id = create.body.data._id;
    const res = await request(app).patch(`/api/tasks/${id}/status`).send({ status: 'Doing' });
    expect(res.statusCode).toBe(400);
  });
});

// ─────────────────────────────────────────────
// Delete Task
// ─────────────────────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  it('should delete a task successfully', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'Delete me' });
    const id = create.body.data._id;
    const res = await request(app).delete(`/api/tasks/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it's gone
    const check = await request(app).get(`/api/tasks/${id}`);
    expect(check.statusCode).toBe(404);
  });

  it('should return 404 when deleting non-existent task', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/tasks/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid ID', async () => {
    const res = await request(app).delete('/api/tasks/bad-id');
    expect(res.statusCode).toBe(400);
  });
});

// ─────────────────────────────────────────────
// Dashboard Stats
// ─────────────────────────────────────────────
describe('GET /api/tasks/stats', () => {
  it('should return correct statistics', async () => {
    await request(app).post('/api/tasks').send({ title: 'Task 1', status: 'Pending' });
    await request(app).post('/api/tasks').send({ title: 'Task 2', status: 'Completed' });
    await request(app).post('/api/tasks').send({ title: 'Task 3', status: 'Pending' });

    const res = await request(app).get('/api/tasks/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(3);
    expect(res.body.data.completed).toBe(1);
    expect(res.body.data.pending).toBe(2);
    expect(res.body.data.completionRate).toBe(33);
  });

  it('should return 0 stats when no tasks exist', async () => {
    const res = await request(app).get('/api/tasks/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.total).toBe(0);
    expect(res.body.data.completionRate).toBe(0);
  });
});

// ─────────────────────────────────────────────
// 404 Route
// ─────────────────────────────────────────────
describe('Unknown Routes', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.statusCode).toBe(404);
  });
});

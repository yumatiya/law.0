const request = require('supertest');
const express = require('express');
const chatRouter = require('./chat');

const app = express();
app.use(express.json());
app.use('/api/chat', chatRouter);

describe('Backend Chat API Thorough Tests', () => {
  const validUserId = 'user1';
  const validMessage = 'Hello there';
  const validMode = 'default';

  describe('POST /send', () => {
    test('should return 400 if any required field is missing', async () => {
      const res1 = await request(app).post('/api/chat/send').send({});
      expect(res1.status).toBe(400);

      const res2 = await request(app).post('/api/chat/send').send({ userId: validUserId });
      expect(res2.status).toBe(400);

      const res3 = await request(app).post('/api/chat/send').send({ userId: validUserId, message: validMessage });
      expect(res3.status).toBe(400);
    });

    test('should return 200 and reply on valid request', async () => {
      const res = await request(app).post('/api/chat/send').send({
        userId: validUserId,
        message: validMessage,
        mode: validMode,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('reply');
      expect(res.body).toHaveProperty('messageId');
      expect(res.body).toHaveProperty('timestamp');
    });

    test('should handle internal server error gracefully', async () => {
      // monkey patch sendToClaude to throw error
      const original = chatRouter.stack.find(layer => layer.route && layer.route.path === '/send').route.stack[0].handle;
      chatRouter.stack.find(layer => layer.route && layer.route.path === '/send').route.stack[0].handle = (req, res) => {
        throw new Error('Test error');
      };
      const res = await request(app).post('/api/chat/send').send({
        userId: validUserId,
        message: validMessage,
        mode: validMode,
      });
      expect(res.status).toBe(500);

      // restore original handler
      chatRouter.stack.find(layer => layer.route && layer.route.path === '/send').route.stack[0].handle = original;
    });
  });

  describe('GET /history', () => {
    test('should return 400 if userId query param is missing', async () => {
      const res = await request(app).get('/api/chat/history');
      expect(res.status).toBe(400);
    });

    test('should return messages array for valid userId', async () => {
      // Send message first to create history
      await request(app).post('/api/chat/send').send({
        userId: validUserId,
        message: validMessage,
        mode: validMode,
      });
      const res = await request(app).get('/api/chat/history').query({ userId: validUserId });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.messages)).toBe(true);
    });

    test('should return 500 if internal error occurs', async () => {
      // monkey patch handler to throw error
      const original = chatRouter.stack.find(layer => layer.route && layer.route.path === '/history').route.stack[0].handle;
      chatRouter.stack.find(layer => layer.route && layer.route.path === '/history').route.stack[0].handle = (req, res) => {
        throw new Error('Test error');
      };
      const res = await request(app).get('/api/chat/history').query({ userId: validUserId });
      expect(res.status).toBe(500);

      // restore handler
      chatRouter.stack.find(layer => layer.route && layer.route.path === '/history').route.stack[0].handle = original;
    });
  });
});



const request = require('supertest');
const { server } = require('./app');
const mongoose = require('mongoose');
const { MessageSchema } = require('./Models/Message'); // Assuming this import exists

describe('Message Controller', () => {
  // Connect to the test database before running tests
  beforeAll(async () => {
    const mongoURI = 'mongodb://localhost:27017/testdb'; // Use your test database URI
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Disconnect from the test database after running tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test the SendMessage function
  it('should send a message and return 201 status', async () => {
    const response = await request(server)
      .post('/api/sendMessage')
      .send({ toUserId: 'receiverId', content: 'Hello, this is a test message.' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Notification sent successfully.');
  });

  // Test the ModerateMessage function
  it('should moderate a message and return 200 status', async () => {
    // Assuming messageId and req.body contain valid data for testing
    const response = await request(server)
      .post(`/api/moderateMessage/${messageId}`)
      .send({ action: 'hide', reason: 'Inappropriate content' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Moderation action successful.');
  });

  // Test the GetMessages function
  it('should get messages and return 200 status', async () => {
    const response = await request(server).get('/api/getMessages');

    expect(response.status).toBe(200);
    // Add more assertions based on the expected data from the GetMessages function
  });

  // Test the SearchMessages function
  it('should search messages and return 200 status', async () => {
    const response = await request(server).get('/api/searchMessages?keyword=test');

    expect(response.status).toBe(200);
    // Add more assertions based on the expected data from the SearchMessages function
  });

  // Test the SendAMessage function
  it('should send a message and return 201 status', async () => {
    const response = await request(server)
      .post('/api/sendAMessage')
      .send({ toUserId: 'receiverId', content: 'Hello, this is a test message.' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Message sent successfully.');
  });

  // Test the ReportMessageAbuse function
  it('should report message abuse and return 201 status', async () => {
    // Assuming _id and req.body contain valid data for testing
    const response = await request(server)
      .post(`/api/reportMessageAbuse/${_id}`)
      .send({ abuseReport: { messageId: 'message123', reason: 'Abuse content' } });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Abuse reported successfully.');
  });
});

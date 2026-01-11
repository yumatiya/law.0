const express = require('express');
const router = express.Router();
const cors = require('cors');

// Mock database for video progress
const videoProgressDB = new Map(); // key: \`\${userId}_\${videoId}\`

router.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

// POST /video/progress - save video progress
router.post('/progress', (req, res) => {
  try {
    const {
      userId,
      videoId,
      progress,
      duration,
      completed,
      mode,
      videoCategory,
      subject,
      chapter,
      deviceType,
      tokenUsage,
    } = req.body;

    if (!userId || !videoId || progress === undefined || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const key = \`\${userId}_\${videoId}\`;
    const now = new Date().toISOString();

    videoProgressDB.set(key, {
      userId,
      videoId,
      progress,
      duration,
      completed: !!completed,
      lastUpdated: now,
      mode,
      videoCategory,
      subject,
      chapter,
      deviceType,
      tokenUsage,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Video progress POST error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /video/progress - get video progress for a user and videoId
router.get('/progress', (req, res) => {
  try {
    const { userId, videoId } = req.query;

    if (!userId || !videoId) {
      return res.status(400).json({ error: 'Missing userId or videoId' });
    }

    const key = \`\${userId}_\${videoId}\`;
    const progressData = videoProgressDB.get(key);

    if (!progressData) {
      return res.status(404).json({ error: 'No progress found' });
    }

    res.json(progressData);
  } catch (error) {
    console.error('Video progress GET error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

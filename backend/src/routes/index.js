const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/journals', require('./journalRoutes'));
router.use('/issues', require('./issueRoutes'));
router.use('/articles', require('./articleRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/announcements', require('./announcementRoutes'));
router.use('/stats', require('./statsRoutes'));
router.use('/upload', require('./uploadRoutes'));

router.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

module.exports = router;

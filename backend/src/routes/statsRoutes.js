const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const role = require('../middlewares/role');
const c = require('../controllers/statsController');

const router = express.Router();

router.get('/', c.summary);
router.get('/search', c.search);
router.get('/admin', authMiddleware, role(['admin', 'editor']), c.adminCharts);

module.exports = router;

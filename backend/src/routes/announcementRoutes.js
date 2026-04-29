const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const role = require('../middlewares/role');
const c = require('../controllers/announcementController');

const router = express.Router();

router.get('/', c.list);
router.get('/:id', c.getById);
router.post('/', authMiddleware, role(['admin', 'editor']), c.create);
router.patch('/:id', authMiddleware, role(['admin', 'editor']), c.update);
router.delete('/:id', authMiddleware, role(['admin', 'editor']), c.remove);

module.exports = router;

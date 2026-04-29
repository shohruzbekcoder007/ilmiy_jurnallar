const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const role = require('../middlewares/role');
const c = require('../controllers/userController');

const router = express.Router();

router.get('/search', authMiddleware, c.searchAuthors);
router.get('/', authMiddleware, role(['admin']), c.list);
router.get('/:id', authMiddleware, role(['admin']), c.getById);
router.patch('/:id/role', authMiddleware, role(['admin']), c.changeRole);
router.delete('/:id', authMiddleware, role(['admin']), c.remove);

module.exports = router;

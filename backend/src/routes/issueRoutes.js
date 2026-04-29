const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const role = require('../middlewares/role');
const c = require('../controllers/issueController');

const router = express.Router();

router.get('/:id/articles', c.articlesOfIssue);
router.post('/', authMiddleware, role(['editor', 'admin']), c.create);
router.patch('/:id', authMiddleware, role(['editor', 'admin']), c.update);
router.delete('/:id', authMiddleware, role(['editor', 'admin']), c.remove);

module.exports = router;

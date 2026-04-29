const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const role = require('../middlewares/role');
const c = require('../controllers/articleController');

const router = express.Router();

router.get('/', c.listPublished);
router.get('/submissions', authMiddleware, role(['editor', 'admin']), c.allSubmissions);
router.get('/mine', authMiddleware, c.myArticles);
router.get('/:id/timeline', authMiddleware, c.timeline);
router.get('/:id/download', c.download);
router.get('/:id', c.getById);

router.post('/', authMiddleware, c.submit);
router.patch('/:id/assign-reviewer', authMiddleware, role(['editor', 'admin']), c.assignReviewer);
router.patch('/:id/status', authMiddleware, role(['editor', 'admin']), c.changeStatus);
router.patch('/:id/publish', authMiddleware, role(['editor', 'admin']), c.publish);
router.patch('/:id', authMiddleware, c.update);
router.delete('/:id', authMiddleware, c.remove);

module.exports = router;

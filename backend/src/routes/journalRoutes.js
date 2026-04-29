const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const role = require('../middlewares/role');
const c = require('../controllers/journalController');

const router = express.Router();

router.get('/', c.list);
router.get('/:slug', c.getBySlug);
router.get('/:slug/issues', c.issuesOfJournal);
router.get('/:slug/articles', c.articlesOfJournal);

router.post('/', authMiddleware, role(['admin']), c.create);
router.patch('/:id', authMiddleware, role(['admin']), c.update);
router.delete('/:id', authMiddleware, role(['admin']), c.remove);

module.exports = router;

const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const role = require('../middlewares/role');
const c = require('../controllers/reviewController');

const router = express.Router();

router.post('/', authMiddleware, role(['reviewer', 'editor', 'admin']), c.submitReview);
router.get('/my', authMiddleware, role(['reviewer', 'editor', 'admin']), c.myReviews);
router.get('/assigned', authMiddleware, role(['reviewer', 'editor', 'admin']), c.assignedToMe);
router.get('/:articleId', authMiddleware, role(['editor', 'admin']), c.reviewsOfArticle);

module.exports = router;

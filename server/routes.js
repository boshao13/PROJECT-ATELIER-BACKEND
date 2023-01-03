const router = require('express').Router();
const controller = require('./controllers/reviews');

router.get('/reviews', controller.getAll);
router.get('/reviews/meta', controller.getMeta);
router.post('/reviews', controller.post);
// router.put('/reviews/:review_id/report', controller.report);
// router.put('/reviews/:review_id/helpful', controller.helpful);

module.exports = router;
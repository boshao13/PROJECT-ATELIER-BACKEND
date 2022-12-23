const router = require('express').Router();
const controller = require('./controllers/reviews');

router.get('/reviews', controller.get);
// router.post('/reviews/', controller.post);
// router.get('/reviews/meta/:id', controller.report);
// router.put('/reviews/:review_id/report', controller.report);
// router.put('/reviews/:review_id/helpful', controller.helpful);

module.exports = router;
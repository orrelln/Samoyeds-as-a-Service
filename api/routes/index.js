const router = module.exports = require('express').Router();

router.use('/breed', require('./breed').router);
router.use('/category', require('./category').router);
router.use(`/id`, require('./id').router);
router.use('/random', require('./random').router);
router.use('/upload', require('./upload').router);
router.use('/status', require('./status').router);

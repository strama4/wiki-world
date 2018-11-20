const express = require('express');
const router = express.Router();
const authenticate = require('../auth/helper');

const wikiController = require('../controllers/wikiController');

router.get('/wikis/new', wikiController.new);
router.get('/wikis/', wikiController.index);
router.post('/wikis/create', authenticate.ensureAuthenticated, wikiController.create);
router.get('/wikis/:id', wikiController.show);
router.get('/wikis/:id/edit', wikiController.edit);
router.post('/wikis/:id/update', authenticate.ensureAuthenticated, wikiController.update);
router.post('/wikis/:id/destroy', wikiController.destroy);

module.exports = router;
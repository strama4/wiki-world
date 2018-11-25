const express = require('express');
const router = express.Router();

const collaboratorController = require('../controllers/collaboratorController');

router.post('/wikis/:id/collaborators/add', collaboratorController.create);
router.post('/wikis/:wikiId/collaborators/:id/remove', collaboratorController.delete);

module.exports = router;
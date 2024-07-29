const express = require('express');
const router = express.Router();
const patrolController = require('../controllers/patrolController');
const { verifySupervisor } = require('../middlewares/AuthMiddleware');

// Create a new patrol
router.post('/create', patrolController.createPatrol);

// Get all patrols
router.get('/', patrolController.getAllPatrols);

// Get a specific patrol by ID
router.get('/:id', patrolController.getPatrolById);

// Update patrol details
router.put('/:id', patrolController.updatePatrol);

// Delete a patrol
router.delete('/:id', patrolController.deletePatrol);

// Get patrols by supervisor
router.get('/supervisor/patrols', verifySupervisor, patrolController.getPatrolsBySupervisor);

module.exports = router;

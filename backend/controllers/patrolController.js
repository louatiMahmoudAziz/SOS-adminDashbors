const Patrol = require('../models/patrolSchema');
const User = require('../models/Users/user'); 
const Urgence = require('../models/urgence/urgenceSchema');  // Correct import path

exports.createPatrol = async (req, res) => {
    try {
        console.log('Request Body:', req.body);  // Log the request body

        // Check if the supervisor already exists
        let supervisor = await User.findOne({ email: req.body.supervisor.email });
        if (!supervisor) {
            // Create the supervisor user
            supervisor = new User({
                fullname: req.body.supervisor.name,
                email: req.body.supervisor.email,
                password: req.body.supervisor.password,
                role: 'patrol_supervisor'
            });
            await supervisor.save();
            console.log('Supervisor created:', supervisor);
        } else {
            console.log('Supervisor already exists:', supervisor);
        }

        // Create the patrol
        const patrol = new Patrol(req.body);
        await patrol.save();
        res.status(201).send(patrol);
    } catch (error) {
        console.error('Error creating patrol:', error.message); // Log the detailed error
        res.status(400).send({ message: error.message });
    }
};

exports.getAllPatrols = async (req, res) => {
    try {
        console.log('Received request to get all patrols');  // Log request reception
        const patrols = await Patrol.find().populate('assignedMissions');
        console.log('Patrols retrieved:', patrols);  // Log retrieved patrols
        res.status(200).send(patrols);
    } catch (error) {
        console.error('Error getting patrols:', error.message); // Log the detailed error
        res.status(400).send({ message: error.message });
    }
};

exports.getPatrolById = async (req, res) => {
    try {
        const patrol = await Patrol.findById(req.params.id).populate('assignedMissions');
        if (!patrol) {
            return res.status(404).send({ message: 'Patrol not found' });
        }
        res.status(200).send(patrol);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updatePatrol = async (req, res) => {
    try {
        const patrol = await Patrol.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!patrol) {
            return res.status(404).send({ message: 'Patrol not found' });
        }
        res.status(200).send(patrol);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deletePatrol = async (req, res) => {
    try {
        console.log('Received request to delete patrol with ID:', req.params.id);  // Log the request
        const patrol = await Patrol.findByIdAndDelete(req.params.id);
        if (!patrol) {
            return res.status(404).send({ message: 'Patrol not found' });
        }
        res.status(200).send({ message: 'Patrol deleted' });
    } catch (error) {
        console.error('Error deleting patrol:', error); // Log the detailed error
        res.status(500).send({ message: error.message });
    }
};

exports.getPatrolsBySupervisor = async (req, res) => {
    try {
        const patrols = await Patrol.find({ 'supervisor.email': req.user.email }).populate('assignedMissions');
        res.status(200).send(patrols);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// patrolController.js

exports.assignUrgencyToPatrol = async (req, res) => {
    const { patrolId, urgencyId } = req.params;
    try {
        const patrol = await Patrol.findById(patrolId).populate('assignedMissions');
        const urgency = await Urgence.findById(urgencyId);

        if (!patrol || !urgency) {
            return res.status(404).send({ message: 'Patrol or Urgency not found' });
        }

        // Check if the urgency is already assigned to this patrol
        if (patrol.assignedMissions.some(mission => mission._id.toString() === urgencyId)) {
            return res.status(409).send({ message: 'This urgency has already been assigned to this patrol' });
        }

        // Add the urgency to the patrol's assignedMissions if not already assigned
        patrol.assignedMissions.push(urgencyId);
        await patrol.save();

        res.status(200).send({ message: 'Urgency assigned to patrol successfully', patrol });
    } catch (error) {
        console.error('Error assigning urgency to patrol:', error);
        res.status(500).send({ message: error.message });
    }
};


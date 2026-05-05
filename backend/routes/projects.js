const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, teamMembers } = req.body;
    const project = new Project({
      name,
      description,
      owner: req.user.id,
      teamMembers: teamMembers || []
    });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('owner', 'name email').populate('teamMembers', 'name email');
    } else {
      const userTasks = await Task.find({ assignedTo: req.user.id });
      const projectIdsFromTasks = userTasks.map(t => t.project);
      
      projects = await Project.find({
        $or: [
          { teamMembers: req.user.id },
          { _id: { $in: projectIdsFromTasks } }
        ]
      }).populate('owner', 'name email').populate('teamMembers', 'name email');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email').populate('teamMembers', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, teamMembers, status } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id, 
      { name, description, teamMembers, status }, 
      { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

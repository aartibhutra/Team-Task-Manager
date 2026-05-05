const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();
router.post('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'Admin' && project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create task' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      project: req.params.projectId,
      createdBy: req.user.id,
      dueDate
    });

    await task.save();
    if (assignedTo && !project.teamMembers.some(id => id.toString() === assignedTo.toString())) {
      project.teamMembers.push(assignedTo);
      await project.save();
    }

    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('project', 'name')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, title, description, assignedTo, dueDate } = req.body;
    let task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (req.user.role === 'Admin') {
      task = await Task.findByIdAndUpdate(req.params.id, 
        { status, title, description, assignedTo, dueDate }, 
        { new: true }).populate('assignedTo', 'name email');
        
      if (assignedTo) {
        const project = await Project.findById(task.project);
        if (project && !project.teamMembers.some(id => id.toString() === assignedTo.toString())) {
          project.teamMembers.push(assignedTo);
          await project.save();
        }
      }
    } else {
      task.status = status || task.status;
      await task.save();
    }
    
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

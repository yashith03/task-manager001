//routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const { 
  getTasks, 
  addTask, 
  updateTask, 
  deleteTask, 
  toggleComplete 
} = require('../controllers/taskController');

// Get all tasks
router.get('/', getTasks);

// Create new task
router.post('/', addTask);

// Update task (PUT route that frontend expects)
router.put('/:id', updateTask);

// Delete task
router.delete('/:id', deleteTask);

// Toggle task completion (optional separate route)
router.patch('/:id/toggle', toggleComplete);

module.exports = router;
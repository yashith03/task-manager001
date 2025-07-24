const prisma = require('../prisma');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (err) {
    console.error(' Error fetching tasks:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new task
exports.addTask = async (req, res) => {
  try {
    const { text, priority = 'Medium', dueDate, tags = [] } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ msg: 'Task text is required' });
    }

    const task = await prisma.task.create({
      data: {
        text: text.trim(),
        priority,
        dueDate: dueDate || null,
        tags,
        completed: false, // default
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(' Error creating task:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists first
    const existingTask = await prisma.task.findUnique({ where: { id } });

    if (!existingTask) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    res.json(task);
  } catch (err) {
    console.error(' Error updating task:', err);
    // Check for specific Prisma error codes
    if (err.code === 'P2025') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id },
    });
    res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    // Catch-all for other DB errors (including simulated test errors)
    res.status(500).json({ msg: 'Server error' });
  }
};

// Toggle task completion
exports.toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;

    const currentTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!currentTask) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { completed: !currentTask.completed },
    });

    res.json(updated);
  } catch (err) {
    console.error(' Error toggling task completion:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};
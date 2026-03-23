const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/v1/expenses
// @access  Private (Admin only)
exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (err) {
    console.error('Error getting expenses:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single expense
// @route   GET /api/v1/expenses/:id
// @access  Private (Admin only)
exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    console.error('Error getting expense:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new expense
// @route   POST /api/v1/expenses
// @access  Private (Admin only)
exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    console.error('Error creating expense:', err);
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update expense
// @route   PUT /api/v1/expenses/:id
// @access  Private (Admin only)
exports.updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    console.error('Error updating expense:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete expense
// @route   DELETE /api/v1/expenses/:id
// @access  Private (Admin only)
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    await expense.deleteOne(); // Use deleteOne to trigger middleware if any

    res.status(200).json({
      success: true,
      data: {}, // Indicate successful deletion with empty data
    });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

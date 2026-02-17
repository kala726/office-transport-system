const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// ============= GET ALL MEMBERS =============
// GET /api/members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching members',
      error: error.message
    });
  }
});

// ============= GET SINGLE MEMBER =============
// GET /api/members/:id
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching member',
      error: error.message
    });
  }
});

// ============= CREATE NEW MEMBER =============
// POST /api/members
router.post('/', async (req, res) => {
  try {
    // Check if member ID already exists (if provided)
    if (req.body.memberId) {
      const existingMember = await Member.findOne({ memberId: req.body.memberId });
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'Member with this ID already exists'
        });
      }
    }

    const member = new Member(req.body);
    await member.save();
    
    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member
    });
  } catch (error) {
    console.error('Error creating member:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating member',
      error: error.message
    });
  }
});

// ============= UPDATE MEMBER =============
// PUT /api/members/:id
router.put('/:id', async (req, res) => {
  try {
    // Check if member ID is being changed and if it already exists
    if (req.body.memberId) {
      const existingMember = await Member.findOne({ 
        memberId: req.body.memberId,
        _id: { $ne: req.params.id }
      });
      
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'Member with this ID already exists'
        });
      }
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });
  } catch (error) {
    console.error('Error updating member:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating member',
      error: error.message
    });
  }
});

// ============= DELETE MEMBER =============
// DELETE /api/members/:id
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting member',
      error: error.message
    });
  }
});

// ============= GET MEMBERS BY DISTRICT =============
// GET /api/members/district/:district
router.get('/district/:district', async (req, res) => {
  try {
    const members = await Member.find({ district: req.params.district });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Error fetching members by district:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching members',
      error: error.message
    });
  }
});

// ============= GET MEMBERS BY STATUS =============
// GET /api/members/status/:status
router.get('/status/:status', async (req, res) => {
  try {
    const members = await Member.find({ status: req.params.status });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Error fetching members by status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching members',
      error: error.message
    });
  }
});

// ============= SEARCH MEMBERS =============
// GET /api/members/search/:query
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const members = await Member.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { memberId: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { district: { $regex: searchQuery, $options: 'i' } },
        { nearTown: { $regex: searchQuery, $options: 'i' } },
        { department: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Error searching members:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching members',
      error: error.message
    });
  }
});

// ============= GET DISTINCT DISTRICTS =============
// GET /api/members/districts/list
router.get('/districts/list', async (req, res) => {
  try {
    const districts = await Member.distinct('district');
    
    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching districts',
      error: error.message
    });
  }
});

module.exports = router;
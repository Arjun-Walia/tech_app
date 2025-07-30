const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Get all public roadmaps
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      page = 1, 
      limit = 10,
      search,
      sort = 'rating'
    } = req.query;

    const query = { 
      isPublic: true, 
      isActive: true 
    };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { 'statistics.enrollments': -1 };
        break;
      default:
        sortOption = { 'rating.average': -1 };
    }

    const roadmaps = await Roadmap.find(query)
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Roadmap.countDocuments(query);

    res.json({
      success: true,
      data: {
        roadmaps,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
    });
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching roadmaps',
    });
  }
});

// Get single roadmap
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid roadmap ID'),
  validateInput,
], async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id)
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .populate('steps.assessmentId', 'title difficulty');

    if (!roadmap || !roadmap.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found',
      });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledRoadmaps.find(
      enr => enr.roadmapId.toString() === roadmap._id.toString()
    );

    res.json({
      success: true,
      data: {
        roadmap,
        isEnrolled: !!enrollment,
        userProgress: enrollment ? enrollment.progress : 0,
        currentStep: enrollment ? enrollment.currentStep : 0,
      },
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching roadmap',
    });
  }
});

// Enroll in roadmap
router.post('/:id/enroll', [
  param('id').isMongoId().withMessage('Invalid roadmap ID'),
  validateInput,
], async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap || !roadmap.isActive || !roadmap.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found or not available',
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already enrolled
    const existingEnrollment = user.enrolledRoadmaps.find(
      enr => enr.roadmapId.toString() === roadmap._id.toString()
    );

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this roadmap',
      });
    }

    // Add enrollment
    user.enrolledRoadmaps.push({
      roadmapId: roadmap._id,
      progress: 0,
      currentStep: 0,
      startedAt: new Date(),
    });

    await user.save();

    // Update roadmap statistics
    roadmap.statistics.enrollments++;
    await roadmap.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in roadmap',
    });
  } catch (error) {
    console.error('Enroll roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while enrolling in roadmap',
    });
  }
});

// Update progress (complete a step)
router.post('/:id/progress', [
  param('id').isMongoId().withMessage('Invalid roadmap ID'),
  body('stepId').isMongoId().withMessage('Invalid step ID'),
  validateInput,
], async (req, res) => {
  try {
    const { stepId } = req.body;
    
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap || !roadmap.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found',
      });
    }

    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledRoadmaps.find(
      enr => enr.roadmapId.toString() === roadmap._id.toString()
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this roadmap',
      });
    }

    // Find the step
    const stepIndex = roadmap.steps.findIndex(
      step => step._id.toString() === stepId
    );

    if (stepIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Step not found',
      });
    }

    // Update progress
    enrollment.currentStep = Math.max(enrollment.currentStep, stepIndex + 1);
    enrollment.progress = roadmap.calculateProgress(
      roadmap.steps.slice(0, enrollment.currentStep).map(step => step._id.toString())
    );

    // Check if roadmap is completed
    if (enrollment.progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
      roadmap.statistics.completions++;
      
      // Award XP for completion
      await user.updateLearningProgress(200); // Bonus for completing roadmap
    }

    await user.save();
    await roadmap.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: enrollment.progress,
        currentStep: enrollment.currentStep,
        completed: enrollment.progress === 100,
      },
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating progress',
    });
  }
});

// Rate roadmap
router.post('/:id/rate', [
  param('id').isMongoId().withMessage('Invalid roadmap ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validateInput,
], async (req, res) => {
  try {
    const { rating } = req.body;
    
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap || !roadmap.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found',
      });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledRoadmaps.find(
      enr => enr.roadmapId.toString() === roadmap._id.toString()
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Must be enrolled to rate this roadmap',
      });
    }

    // Update rating (simple average for now - in production, you'd want to store individual ratings)
    const currentAverage = roadmap.rating.average;
    const currentCount = roadmap.rating.count;
    
    roadmap.rating.count++;
    roadmap.rating.average = ((currentAverage * currentCount) + rating) / roadmap.rating.count;

    await roadmap.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        newAverage: roadmap.rating.average,
        totalRatings: roadmap.rating.count,
      },
    });
  } catch (error) {
    console.error('Rate roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rating roadmap',
    });
  }
});

// Get user's enrolled roadmaps
router.get('/user/enrolled', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledRoadmaps.roadmapId', 'title category difficulty estimatedDuration');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { enrolledRoadmaps: user.enrolledRoadmaps },
    });
  } catch (error) {
    console.error('Get enrolled roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled roadmaps',
    });
  }
});

// Create roadmap (Admin/Instructor only)
router.post('/', [
  authorize('admin', 'instructor'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['frontend', 'backend', 'mobile', 'devops', 'ai-ml', 'data-science', 'cybersecurity', 'full-stack']).withMessage('Invalid category'),
  body('steps').isArray({ min: 1 }).withMessage('At least one step is required'),
  validateInput,
], async (req, res) => {
  try {
    const roadmapData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const roadmap = new Roadmap(roadmapData);
    await roadmap.save();

    res.status(201).json({
      success: true,
      message: 'Roadmap created successfully',
      data: { roadmap },
    });
  } catch (error) {
    console.error('Create roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating roadmap',
    });
  }
});

module.exports = router;

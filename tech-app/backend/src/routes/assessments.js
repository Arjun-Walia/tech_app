const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Assessment = require('../models/Assessment');
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

// Get all assessments
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    const query = { isActive: true };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const assessments = await Assessment.find(query)
      .select('-questions.options.isCorrect -questions.explanation')
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Assessment.countDocuments(query);

    res.json({
      success: true,
      data: {
        assessments,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assessments',
    });
  }
});

// Get assessment for taking (without answers)
router.get('/:id/take', [
  param('id').isMongoId().withMessage('Invalid assessment ID'),
  validateInput,
], async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment || !assessment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    // Check if user has already taken this assessment max times
    const user = await User.findById(req.user._id);
    const attemptCount = user.assessmentResults.filter(
      result => result.assessmentId.toString() === assessment._id.toString()
    ).length;

    if (attemptCount >= assessment.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `Maximum attempts (${assessment.maxAttempts}) reached for this assessment`,
      });
    }

    // Return assessment without answers
    const assessmentForTaking = assessment.getAssessmentForTaking();

    res.json({
      success: true,
      data: {
        assessment: assessmentForTaking,
        attemptsUsed: attemptCount,
        maxAttempts: assessment.maxAttempts,
      },
    });
  } catch (error) {
    console.error('Get assessment for taking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assessment',
    });
  }
});

// Submit assessment
router.post('/:id/submit', [
  param('id').isMongoId().withMessage('Invalid assessment ID'),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('timeSpent').isNumeric().withMessage('Time spent must be a number'),
  validateInput,
], async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment || !assessment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    // Check if user has already taken this assessment max times
    const user = await User.findById(req.user._id);
    const attemptCount = user.assessmentResults.filter(
      result => result.assessmentId.toString() === assessment._id.toString()
    ).length;

    if (attemptCount >= assessment.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `Maximum attempts (${assessment.maxAttempts}) reached for this assessment`,
      });
    }

    // Calculate score
    const score = assessment.calculateScore(answers);
    
    // Determine skill level based on score
    let skillLevel = 'beginner';
    if (score >= 80) skillLevel = 'advanced';
    else if (score >= 60) skillLevel = 'intermediate';

    // Create detailed answers array
    const detailedAnswers = answers.map((answer, index) => ({
      questionId: assessment.questions[index]._id,
      selectedAnswer: answer,
      isCorrect: assessment.isAnswerCorrect(assessment.questions[index], answer),
      timeSpent: Math.round(timeSpent / answers.length), // Average time per question
    }));

    // Add result to user
    const assessmentResult = {
      assessmentId: assessment._id,
      score,
      skillLevel,
      answers: detailedAnswers,
      completedAt: new Date(),
    };

    user.assessmentResults.push(assessmentResult);

    // Update user's learning progress
    const xpGained = Math.round(score * 0.5); // 50 XP for 100% score
    await user.updateLearningProgress(xpGained);
    await user.updateStreak();

    // Update assessment statistics
    assessment.statistics.totalAttempts++;
    assessment.statistics.averageScore = 
      (assessment.statistics.averageScore * (assessment.statistics.totalAttempts - 1) + score) / 
      assessment.statistics.totalAttempts;
    
    if (score >= assessment.passingScore) {
      assessment.statistics.passRate = 
        ((assessment.statistics.passRate * (assessment.statistics.totalAttempts - 1)) + 100) / 
        assessment.statistics.totalAttempts;
    }

    assessment.statistics.averageTime = 
      (assessment.statistics.averageTime * (assessment.statistics.totalAttempts - 1) + timeSpent) / 
      assessment.statistics.totalAttempts;

    await assessment.save();

    // Get results with explanations
    const resultsWithExplanations = assessment.questions.map((question, index) => ({
      question: question.text,
      userAnswer: answers[index],
      correctAnswer: question.options.find(opt => opt.isCorrect)?.text,
      isCorrect: detailedAnswers[index].isCorrect,
      explanation: question.explanation,
      points: detailedAnswers[index].isCorrect ? question.points : 0,
    }));

    res.json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        score,
        skillLevel,
        passed: score >= assessment.passingScore,
        xpGained,
        results: resultsWithExplanations,
        attemptsUsed: attemptCount + 1,
        maxAttempts: assessment.maxAttempts,
      },
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting assessment',
    });
  }
});

// Get user's assessment results
router.get('/results', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('assessmentResults.assessmentId', 'title category difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const results = user.assessmentResults
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    res.json({
      success: true,
      data: { results },
    });
  } catch (error) {
    console.error('Get assessment results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching results',
    });
  }
});

// Create assessment (Admin/Instructor only)
router.post('/', [
  authorize('admin', 'instructor'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['frontend', 'backend', 'mobile', 'devops', 'ai-ml', 'data-science', 'cybersecurity', 'general']).withMessage('Invalid category'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  validateInput,
], async (req, res) => {
  try {
    const assessmentData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const assessment = new Assessment(assessmentData);
    await assessment.save();

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: { assessment },
    });
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating assessment',
    });
  }
});

module.exports = router;

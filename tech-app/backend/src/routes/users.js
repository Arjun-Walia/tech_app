const express = require('express');
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
const { authorize, authorizeOwnerOrAdmin } = require('../middleware/auth');

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

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledRoadmaps.roadmapId', 'title category difficulty')
      .populate('assessmentResults.assessmentId', 'title category difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
    });
  }
});

// Update user profile
router.put('/profile', [
  body('profile.firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('profile.lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profile.location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('profile.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  validateInput,
], async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update profile fields
    if (updates.profile) {
      Object.keys(updates.profile).forEach(key => {
        if (updates.profile[key] !== undefined) {
          user.profile[key] = updates.profile[key];
        }
      });
    }

    // Update preferences
    if (updates.preferences) {
      Object.keys(updates.preferences).forEach(key => {
        if (updates.preferences[key] !== undefined) {
          user.preferences[key] = updates.preferences[key];
        }
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
    });
  }
});

// Change password
router.put('/change-password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  validateInput,
], async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password',
    });
  }
});

// Get user dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledRoadmaps.roadmapId', 'title category difficulty steps')
      .populate('assessmentResults.assessmentId', 'title category difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate dashboard statistics
    const stats = {
      totalXP: user.learningProgress.totalXP,
      currentLevel: user.learningProgress.level,
      currentStreak: user.learningProgress.streak,
      enrolledRoadmaps: user.enrolledRoadmaps.length,
      completedAssessments: user.assessmentResults.length,
      averageScore: user.assessmentResults.length > 0 
        ? Math.round(user.assessmentResults.reduce((sum, result) => sum + result.score, 0) / user.assessmentResults.length)
        : 0,
    };

    // Get recent activity
    const recentAssessments = user.assessmentResults
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5);

    // Get active roadmaps
    const activeRoadmaps = user.enrolledRoadmaps
      .filter(enrollment => enrollment.progress < 100)
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

    res.json({
      success: true,
      data: {
        stats,
        recentAssessments,
        activeRoadmaps,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data',
    });
  }
});

// Get user learning progress
router.get('/progress', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledRoadmaps.roadmapId', 'title category difficulty totalSteps')
      .populate('assessmentResults.assessmentId', 'title category difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate skill progress by category
    const skillProgress = {};
    user.assessmentResults.forEach(result => {
      const category = result.assessmentId.category;
      if (!skillProgress[category]) {
        skillProgress[category] = {
          category,
          totalAssessments: 0,
          averageScore: 0,
          bestScore: 0,
          latestScore: 0,
        };
      }
      
      skillProgress[category].totalAssessments++;
      skillProgress[category].bestScore = Math.max(skillProgress[category].bestScore, result.score);
      skillProgress[category].latestScore = result.score; // This will be the latest due to sorting
    });

    // Calculate average scores
    Object.keys(skillProgress).forEach(category => {
      const categoryResults = user.assessmentResults.filter(r => r.assessmentId.category === category);
      skillProgress[category].averageScore = Math.round(
        categoryResults.reduce((sum, r) => sum + r.score, 0) / categoryResults.length
      );
    });

    res.json({
      success: true,
      data: {
        learningProgress: user.learningProgress,
        skillProgress: Object.values(skillProgress),
        roadmapProgress: user.enrolledRoadmaps,
        recentActivity: user.assessmentResults
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 10),
      },
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching progress data',
    });
  }
});

// Update learning preferences
router.put('/preferences', [
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be light, dark, or system'),
  body('learningGoals')
    .optional()
    .isArray()
    .withMessage('Learning goals must be an array'),
  body('learningGoals.*')
    .optional()
    .isIn(['frontend', 'backend', 'mobile', 'devops', 'ai-ml', 'data-science', 'cybersecurity'])
    .withMessage('Invalid learning goal'),
  validateInput,
], async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update preferences
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        user.preferences[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: user.preferences },
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences',
    });
  }
});

// Delete user account
router.delete('/account', [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account'),
  validateInput,
], async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    user.username = `deleted_${Date.now()}_${user.username}`;
    
    await user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account',
    });
  }
});

// Admin routes
// Get all users (Admin only)
router.get('/admin/users', authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } },
      ];
    }
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
});

// Update user role (Admin only)
router.put('/admin/users/:userId/role', [
  authorize('admin'),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('role')
    .isIn(['user', 'admin', 'instructor'])
    .withMessage('Role must be user, admin, or instructor'),
  validateInput,
], async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user role',
    });
  }
});

module.exports = router;

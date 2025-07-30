const express = require('express');
const { param, query, validationResult } = require('express-validator');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Roadmap = require('../models/Roadmap');

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

// Get user's overall progress summary
router.get('/summary', async (req, res) => {
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

    // Calculate overall statistics
    const totalAssessments = user.assessmentResults.length;
    const averageScore = totalAssessments > 0 
      ? Math.round(user.assessmentResults.reduce((sum, result) => sum + result.score, 0) / totalAssessments)
      : 0;

    const completedRoadmaps = user.enrolledRoadmaps.filter(enr => enr.progress === 100).length;
    const activeRoadmaps = user.enrolledRoadmaps.filter(enr => enr.progress < 100).length;

    // Calculate skill levels by category
    const skillLevels = {};
    user.assessmentResults.forEach(result => {
      const category = result.assessmentId.category;
      if (!skillLevels[category]) {
        skillLevels[category] = {
          category,
          assessments: [],
          averageScore: 0,
          level: 'beginner',
        };
      }
      skillLevels[category].assessments.push(result);
    });

    // Calculate average scores and levels for each category
    Object.keys(skillLevels).forEach(category => {
      const assessments = skillLevels[category].assessments;
      skillLevels[category].averageScore = Math.round(
        assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length
      );
      
      // Determine skill level based on average score
      if (skillLevels[category].averageScore >= 80) {
        skillLevels[category].level = 'advanced';
      } else if (skillLevels[category].averageScore >= 60) {
        skillLevels[category].level = 'intermediate';
      }
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAssessments = user.assessmentResults.filter(
      result => new Date(result.completedAt) >= thirtyDaysAgo
    ).length;

    res.json({
      success: true,
      data: {
        overview: {
          totalXP: user.learningProgress.totalXP,
          currentLevel: user.learningProgress.level,
          currentStreak: user.learningProgress.streak,
          totalAssessments,
          averageScore,
          completedRoadmaps,
          activeRoadmaps,
          recentActivity: recentAssessments,
        },
        skillLevels: Object.values(skillLevels),
        learningGoals: user.preferences.learningGoals,
      },
    });
  } catch (error) {
    console.error('Get progress summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching progress summary',
    });
  }
});

// Get detailed progress for a specific category
router.get('/category/:category', [
  param('category').isIn(['frontend', 'backend', 'mobile', 'devops', 'ai-ml', 'data-science', 'cybersecurity']).withMessage('Invalid category'),
  validateInput,
], async (req, res) => {
  try {
    const { category } = req.params;
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'assessmentResults.assessmentId',
        match: { category },
        select: 'title category difficulty'
      })
      .populate({
        path: 'enrolledRoadmaps.roadmapId',
        match: { category },
        select: 'title category difficulty steps'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Filter results to only include the specified category
    const categoryAssessments = user.assessmentResults.filter(
      result => result.assessmentId && result.assessmentId.category === category
    );

    const categoryRoadmaps = user.enrolledRoadmaps.filter(
      enr => enr.roadmapId && enr.roadmapId.category === category
    );

    // Calculate category statistics
    const totalAssessments = categoryAssessments.length;
    const averageScore = totalAssessments > 0 
      ? Math.round(categoryAssessments.reduce((sum, result) => sum + result.score, 0) / totalAssessments)
      : 0;

    let skillLevel = 'beginner';
    if (averageScore >= 80) skillLevel = 'advanced';
    else if (averageScore >= 60) skillLevel = 'intermediate';

    // Get improvement over time
    const sortedAssessments = categoryAssessments
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

    const improvement = sortedAssessments.length >= 2 
      ? sortedAssessments[sortedAssessments.length - 1].score - sortedAssessments[0].score
      : 0;

    res.json({
      success: true,
      data: {
        category,
        statistics: {
          totalAssessments,
          averageScore,
          skillLevel,
          improvement,
          completedRoadmaps: categoryRoadmaps.filter(r => r.progress === 100).length,
          activeRoadmaps: categoryRoadmaps.filter(r => r.progress < 100).length,
        },
        assessments: sortedAssessments,
        roadmaps: categoryRoadmaps,
      },
    });
  } catch (error) {
    console.error('Get category progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category progress',
    });
  }
});

// Get learning analytics/charts data
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const days = parseInt(period);
    
    const user = await User.findById(req.user._id)
      .populate('assessmentResults.assessmentId', 'title category difficulty')
      .populate('enrolledRoadmaps.roadmapId', 'title category difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get assessments within the period
    const periodAssessments = user.assessmentResults.filter(
      result => new Date(result.completedAt) >= startDate
    );

    // Group by date for timeline chart
    const dailyActivity = {};
    periodAssessments.forEach(result => {
      const date = new Date(result.completedAt).toDateString();
      if (!dailyActivity[date]) {
        dailyActivity[date] = {
          date,
          assessments: 0,
          totalScore: 0,
          averageScore: 0,
        };
      }
      dailyActivity[date].assessments++;
      dailyActivity[date].totalScore += result.score;
      dailyActivity[date].averageScore = Math.round(
        dailyActivity[date].totalScore / dailyActivity[date].assessments
      );
    });

    // Score distribution
    const scoreRanges = {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      'Below 60': 0,
    };

    periodAssessments.forEach(result => {
      if (result.score >= 90) scoreRanges['90-100']++;
      else if (result.score >= 80) scoreRanges['80-89']++;
      else if (result.score >= 70) scoreRanges['70-79']++;
      else if (result.score >= 60) scoreRanges['60-69']++;
      else scoreRanges['Below 60']++;
    });

    // Category distribution
    const categoryStats = {};
    periodAssessments.forEach(result => {
      const category = result.assessmentId.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
          count: 0,
          totalScore: 0,
          averageScore: 0,
        };
      }
      categoryStats[category].count++;
      categoryStats[category].totalScore += result.score;
      categoryStats[category].averageScore = Math.round(
        categoryStats[category].totalScore / categoryStats[category].count
      );
    });

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalActivity: periodAssessments.length,
        dailyActivity: Object.values(dailyActivity).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        ),
        scoreDistribution: scoreRanges,
        categoryBreakdown: Object.values(categoryStats),
        streak: user.learningProgress.streak,
        levelProgress: {
          currentLevel: user.learningProgress.level,
          currentXP: user.learningProgress.totalXP,
          xpForNextLevel: (user.learningProgress.level * 1000) - (user.learningProgress.totalXP % 1000),
        },
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics',
    });
  }
});

// Get progress comparison with other users (anonymized)
router.get('/compare', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get statistics for comparison
    const allUsers = await User.find({ isActive: true })
      .select('learningProgress assessmentResults');

    // Calculate user's percentile ranking
    const userXP = user.learningProgress.totalXP;
    const userLevel = user.learningProgress.level;
    const userAvgScore = user.assessmentResults.length > 0
      ? user.assessmentResults.reduce((sum, r) => sum + r.score, 0) / user.assessmentResults.length
      : 0;

    const xpRanking = allUsers.filter(u => u.learningProgress.totalXP < userXP).length;
    const levelRanking = allUsers.filter(u => u.learningProgress.level < userLevel).length;
    
    const avgScoreRanking = allUsers.filter(u => {
      const avgScore = u.assessmentResults.length > 0
        ? u.assessmentResults.reduce((sum, r) => sum + r.score, 0) / u.assessmentResults.length
        : 0;
      return avgScore < userAvgScore;
    }).length;

    const totalUsers = allUsers.length;

    res.json({
      success: true,
      data: {
        rankings: {
          xp: {
            percentile: Math.round((xpRanking / totalUsers) * 100),
            position: xpRanking + 1,
            totalUsers,
          },
          level: {
            percentile: Math.round((levelRanking / totalUsers) * 100),
            position: levelRanking + 1,
            totalUsers,
          },
          averageScore: {
            percentile: Math.round((avgScoreRanking / totalUsers) * 100),
            position: avgScoreRanking + 1,
            totalUsers,
          },
        },
        userStats: {
          totalXP: userXP,
          level: userLevel,
          averageScore: Math.round(userAvgScore),
          totalAssessments: user.assessmentResults.length,
        },
      },
    });
  } catch (error) {
    console.error('Get comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comparison data',
    });
  }
});

module.exports = router;

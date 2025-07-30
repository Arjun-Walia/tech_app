const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Step title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Step description is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['reading', 'video', 'practice', 'project', 'assessment', 'quiz'],
    required: [true, 'Step type is required'],
  },
  content: {
    url: String, // For videos, articles, external links
    text: String, // For text content
    duration: Number, // Estimated time in minutes
    resources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['article', 'video', 'documentation', 'tool', 'course'],
      },
    }],
  },
  prerequisites: [{
    stepId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    title: String,
  }],
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
  }],
  estimatedTime: {
    type: Number, // in hours
    default: 1,
  },
  order: {
    type: Number,
    required: true,
  },
  isOptional: {
    type: Boolean,
    default: false,
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
  },
});

const roadmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Roadmap title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Roadmap description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Roadmap category is required'],
    enum: ['frontend', 'backend', 'mobile', 'devops', 'ai-ml', 'data-science', 'cybersecurity', 'full-stack'],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  steps: [stepSchema],
  prerequisites: [{
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['skill', 'course', 'experience'],
    },
  }],
  learningOutcomes: [{
    type: String,
    required: true,
  }],
  estimatedDuration: {
    weeks: {
      type: Number,
      default: 8,
    },
    hoursPerWeek: {
      type: Number,
      default: 10,
    },
  },
  tags: [{
    type: String,
    trim: true,
  }],
  technologies: [{
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['language', 'framework', 'library', 'tool', 'database', 'platform'],
    },
    importance: {
      type: String,
      enum: ['essential', 'recommended', 'optional'],
      default: 'recommended',
    },
  }],
  projects: [{
    title: String,
    description: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    estimatedHours: Number,
    skills: [String],
    githubUrl: String,
    liveUrl: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  statistics: {
    enrollments: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
    averageCompletionTime: {
      type: Number,
      default: 0, // in days
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for total steps
roadmapSchema.virtual('totalSteps').get(function() {
  return this.steps.length;
});

// Virtual for total estimated hours
roadmapSchema.virtual('totalEstimatedHours').get(function() {
  return this.steps.reduce((total, step) => total + (step.estimatedTime || 0), 0);
});

// Virtual for completion rate
roadmapSchema.virtual('completionRate').get(function() {
  if (this.statistics.enrollments === 0) return 0;
  return Math.round((this.statistics.completions / this.statistics.enrollments) * 100);
});

// Index for faster queries
roadmapSchema.index({ category: 1, difficulty: 1 });
roadmapSchema.index({ tags: 1 });
roadmapSchema.index({ isPublic: 1, isActive: 1 });
roadmapSchema.index({ createdBy: 1 });
roadmapSchema.index({ 'rating.average': -1 });

// Method to get next step for user
roadmapSchema.methods.getNextStep = function(currentStepIndex) {
  if (currentStepIndex >= this.steps.length - 1) {
    return null; // Roadmap completed
  }
  return this.steps[currentStepIndex + 1];
};

// Method to check if user can access step
roadmapSchema.methods.canAccessStep = function(stepIndex, completedSteps) {
  if (stepIndex === 0) return true; // First step is always accessible
  
  const step = this.steps[stepIndex];
  if (!step) return false;
  
  // Check if all prerequisites are completed
  if (step.prerequisites && step.prerequisites.length > 0) {
    return step.prerequisites.every(prereq => 
      completedSteps.includes(prereq.stepId.toString())
    );
  }
  
  // If no specific prerequisites, check if previous step is completed
  return completedSteps.includes(this.steps[stepIndex - 1]._id.toString());
};

// Method to calculate progress percentage
roadmapSchema.methods.calculateProgress = function(completedSteps) {
  if (this.steps.length === 0) return 0;
  
  const completedCount = this.steps.filter(step => 
    completedSteps.includes(step._id.toString())
  ).length;
  
  return Math.round((completedCount / this.steps.length) * 100);
};

module.exports = mongoose.model('Roadmap', roadmapSchema);

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'coding', 'drag-drop'],
    default: 'multiple-choice',
  },
  options: [{
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  }],
  explanation: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  points: {
    type: Number,
    default: 10,
    min: 1,
    max: 100,
  },
  timeLimit: {
    type: Number, // in seconds
    default: 60,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  codeSnippet: {
    type: String, // For coding questions
  },
  language: {
    type: String, // Programming language for coding questions
    enum: ['javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'typescript'],
  },
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assessment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Assessment description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Assessment category is required'],
    enum: ['frontend', 'backend', 'mobile', 'devops', 'ai-ml', 'data-science', 'cybersecurity', 'general'],
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
  questions: [questionSchema],
  duration: {
    type: Number, // in minutes
    required: [true, 'Assessment duration is required'],
    min: 5,
    max: 180,
  },
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100,
  },
  maxAttempts: {
    type: Number,
    default: 3,
    min: 1,
    max: 10,
  },
  prerequisites: [{
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
    },
    minimumScore: {
      type: Number,
      default: 70,
    },
  }],
  skills: [{
    name: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 2,
    },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    passRate: {
      type: Number,
      default: 0,
    },
    averageTime: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for total points
assessmentSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

// Virtual for question count
assessmentSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Index for faster queries
assessmentSchema.index({ category: 1, difficulty: 1 });
assessmentSchema.index({ tags: 1 });
assessmentSchema.index({ isActive: 1 });
assessmentSchema.index({ createdBy: 1 });

// Method to calculate score
assessmentSchema.methods.calculateScore = function(answers) {
  let totalPoints = 0;
  let earnedPoints = 0;
  
  this.questions.forEach((question, index) => {
    totalPoints += question.points;
    
    const userAnswer = answers[index];
    if (userAnswer && this.isAnswerCorrect(question, userAnswer)) {
      earnedPoints += question.points;
    }
  });
  
  return Math.round((earnedPoints / totalPoints) * 100);
};

// Method to check if answer is correct
assessmentSchema.methods.isAnswerCorrect = function(question, userAnswer) {
  if (question.type === 'multiple-choice') {
    const correctOption = question.options.find(option => option.isCorrect);
    return correctOption && correctOption.text === userAnswer;
  }
  
  if (question.type === 'true-false') {
    const correctOption = question.options.find(option => option.isCorrect);
    return correctOption && correctOption.text === userAnswer;
  }
  
  // For coding questions, this would need more complex evaluation
  return false;
};

// Method to get assessment without answers (for taking assessment)
assessmentSchema.methods.getAssessmentForTaking = function() {
  const assessment = this.toObject();
  
  // Remove correct answers from options
  assessment.questions = assessment.questions.map(question => ({
    ...question,
    options: question.options.map(option => ({
      text: option.text,
      // Don't include isCorrect field
    })),
    // Don't include explanation
    explanation: undefined,
  }));
  
  return assessment;
};

module.exports = mongoose.model('Assessment', assessmentSchema);

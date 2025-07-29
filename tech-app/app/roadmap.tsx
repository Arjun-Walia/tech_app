import { Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  resources: Resource[];
  completed: boolean;
  category: 'foundation' | 'intermediate' | 'advanced' | 'projects';
}

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'documentation' | 'practice' | 'project';
  url: string;
  description: string;
  free: boolean;
}

export default function RoadmapScreen() {
  console.log('RoadmapScreen rendered');
  
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Mock roadmap data - in a real app, this would be generated based on assessment
  const roadmapSteps: RoadmapStep[] = [
    {
      id: 'html-basics',
      title: 'HTML Fundamentals',
      description: 'Learn the building blocks of web pages with HTML elements, attributes, and semantic markup.',
      estimatedTime: '1-2 weeks',
      category: 'foundation',
      completed: false,
      resources: [
        {
          id: 'mdn-html',
          title: 'MDN HTML Basics',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics',
          description: 'Comprehensive HTML guide from Mozilla',
          free: true
        },
        {
          id: 'freecodecamp-html',
          title: 'freeCodeCamp HTML Course',
          type: 'video',
          url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
          description: 'Interactive HTML lessons with hands-on practice',
          free: true
        }
      ]
    },
    {
      id: 'css-basics',
      title: 'CSS Styling',
      description: 'Master CSS to style your web pages with colors, layouts, and responsive design.',
      estimatedTime: '2-3 weeks',
      category: 'foundation',
      completed: false,
      resources: [
        {
          id: 'mdn-css',
          title: 'MDN CSS Basics',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS',
          description: 'Complete CSS learning path',
          free: true
        },
        {
          id: 'css-tricks',
          title: 'CSS-Tricks Flexbox Guide',
          type: 'article',
          url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
          description: 'Master modern CSS layouts',
          free: true
        }
      ]
    },
    {
      id: 'javascript-basics',
      title: 'JavaScript Fundamentals',
      description: 'Learn programming concepts with JavaScript: variables, functions, and DOM manipulation.',
      estimatedTime: '3-4 weeks',
      category: 'foundation',
      completed: false,
      resources: [
        {
          id: 'mdn-js',
          title: 'MDN JavaScript Guide',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
          description: 'Comprehensive JavaScript reference',
          free: true
        },
        {
          id: 'javascript30',
          title: 'JavaScript30',
          type: 'practice',
          url: 'https://javascript30.com/',
          description: '30 day vanilla JavaScript challenge',
          free: true
        }
      ]
    },
    {
      id: 'first-project',
      title: 'Build Your First Website',
      description: 'Create a personal portfolio website using HTML, CSS, and JavaScript.',
      estimatedTime: '1-2 weeks',
      category: 'projects',
      completed: false,
      resources: [
        {
          id: 'portfolio-guide',
          title: 'Portfolio Website Tutorial',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=xV7S8BhIeBo',
          description: 'Step-by-step portfolio creation',
          free: true
        }
      ]
    },
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      description: 'Learn the most popular frontend framework for building interactive user interfaces.',
      estimatedTime: '4-5 weeks',
      category: 'intermediate',
      completed: false,
      resources: [
        {
          id: 'react-docs',
          title: 'Official React Tutorial',
          type: 'documentation',
          url: 'https://react.dev/learn',
          description: 'Learn React from the official docs',
          free: true
        },
        {
          id: 'react-course',
          title: 'React Course for Beginners',
          type: 'video',
          url: 'https://www.freecodecamp.org/news/react-course/',
          description: 'Complete React course on freeCodeCamp',
          free: true
        }
      ]
    }
  ];

  const toggleStepCompletion = (stepId: string) => {
    console.log('Toggling step completion:', stepId);
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const handleGoToDashboard = () => {
    console.log('Going to dashboard');
    router.push('/dashboard');
  };

  const getProgressPercentage = () => {
    return Math.round((completedSteps.length / roadmapSteps.length) * 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'foundation': return 'school';
      case 'intermediate': return 'build';
      case 'advanced': return 'rocket';
      case 'projects': return 'hammer';
      default: return 'book';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foundation': return colors.primary;
      case 'intermediate': return colors.accent;
      case 'advanced': return '#8B5CF6';
      case 'projects': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return 'play-circle';
      case 'article': return 'document-text';
      case 'documentation': return 'book';
      case 'practice': return 'code-slash';
      case 'project': return 'hammer';
      default: return 'link';
    }
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
        <View style={commonStyles.content}>
          <Text style={[commonStyles.title, { marginBottom: 8 }]}>
            Your Learning Roadmap
          </Text>
          <Text style={[commonStyles.textSecondary, commonStyles.textCenter, { marginBottom: 24 }]}>
            Frontend Developer Path
          </Text>

          {/* Progress Overview */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
                  Progress Overview
                </Text>
                <Text style={commonStyles.textSecondary}>
                  {completedSteps.length} of {roadmapSteps.length} steps completed
                </Text>
              </View>
              <View style={[commonStyles.rowCenter, { backgroundColor: colors.success, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }]}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  {getProgressPercentage()}%
                </Text>
              </View>
            </View>
            
            <View style={commonStyles.progressBar}>
              <View 
                style={[
                  commonStyles.progressFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
          </View>

          {/* Roadmap Steps */}
          {roadmapSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isExpanded = selectedStep === step.id;
            const categoryColor = getCategoryColor(step.category);

            return (
              <View key={step.id} style={[commonStyles.cardSmall, { marginBottom: 12 }]}>
                <View style={[commonStyles.row, { alignItems: 'flex-start', marginBottom: 12 }]}>
                  <View style={[commonStyles.rowCenter, { marginRight: 12, marginTop: 4 }]}>
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: isCompleted ? colors.success : categoryColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8
                    }}>
                      <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                        {index + 1}
                      </Text>
                    </View>
                    <Icon 
                      name={getCategoryIcon(step.category) as any} 
                      size={20} 
                      style={{ color: categoryColor }} 
                    />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 4 }]}>
                      {step.title}
                    </Text>
                    <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                      {step.description}
                    </Text>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12, fontWeight: '600' }]}>
                      Estimated time: {step.estimatedTime}
                    </Text>
                  </View>
                </View>

                <View style={[commonStyles.row, { marginBottom: isExpanded ? 16 : 0 }]}>
                  <Button
                    text={isExpanded ? "Hide Resources" : "View Resources"}
                    onPress={() => setSelectedStep(isExpanded ? null : step.id)}
                    style={[buttonStyles.secondary, buttonStyles.small, { flex: 1, marginRight: 8 }]}
                    textStyle={{ color: colors.primary, fontSize: 14, fontWeight: '500' }}
                  />
                  
                  <Button
                    text={isCompleted ? "Completed" : "Mark Complete"}
                    onPress={() => toggleStepCompletion(step.id)}
                    style={[
                      isCompleted ? buttonStyles.primary : buttonStyles.accent,
                      buttonStyles.small,
                      { flex: 1 }
                    ]}
                    textStyle={{ 
                      color: 'white', 
                      fontSize: 14, 
                      fontWeight: '500' 
                    }}
                  />
                </View>

                {/* Resources */}
                {isExpanded && (
                  <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 }}>
                    <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 12 }]}>
                      Learning Resources
                    </Text>
                    
                    {step.resources.map((resource) => (
                      <View key={resource.id} style={[commonStyles.row, { marginBottom: 12, alignItems: 'flex-start' }]}>
                        <Icon 
                          name={getResourceIcon(resource.type) as any} 
                          size={20} 
                          style={{ color: colors.primary, marginTop: 2, marginRight: 12 }} 
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={[commonStyles.text, { fontSize: 15, fontWeight: '600', marginBottom: 2 }]}>
                            {resource.title}
                          </Text>
                          <Text style={[commonStyles.textSecondary, { fontSize: 13, marginBottom: 4 }]}>
                            {resource.description}
                          </Text>
                          <View style={[commonStyles.rowCenter, { justifyContent: 'flex-start' }]}>
                            <View style={{
                              backgroundColor: resource.free ? colors.success : colors.accent,
                              borderRadius: 12,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              marginRight: 8
                            }}>
                              <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>
                                {resource.free ? 'FREE' : 'PAID'}
                              </Text>
                            </View>
                            <Text style={[commonStyles.textSecondary, { fontSize: 11, textTransform: 'uppercase' }]}>
                              {resource.type}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          <View style={commonStyles.buttonContainer}>
            <Button
              text="Go to Dashboard"
              onPress={handleGoToDashboard}
              style={buttonStyles.primary}
              textStyle={{ color: 'white', fontSize: 18, fontWeight: '600' }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
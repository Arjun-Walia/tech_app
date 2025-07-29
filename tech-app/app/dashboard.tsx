import { Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

export default function DashboardScreen() {
  console.log('DashboardScreen rendered');
  
  const [user] = useState({
    name: 'Alex',
    currentPath: 'Frontend Developer',
    completedSteps: 2,
    totalSteps: 5,
    streak: 7,
    nextMilestone: 'Complete JavaScript Fundamentals'
  });

  const quickActions = [
    {
      id: 'continue-learning',
      title: 'Continue Learning',
      description: 'Pick up where you left off',
      icon: 'play-circle',
      color: colors.primary,
      action: () => router.push('/roadmap')
    },
    {
      id: 'explore-domains',
      title: 'Explore Domains',
      description: 'Discover other tech paths',
      icon: 'compass',
      color: colors.accent,
      action: () => console.log('Explore domains')
    },
    {
      id: 'practice',
      title: 'Practice Coding',
      description: 'Sharpen your skills',
      icon: 'code-slash',
      color: colors.success,
      action: () => console.log('Practice coding')
    },
    {
      id: 'profile',
      title: 'Update Profile',
      description: 'Manage your preferences',
      icon: 'person-circle',
      color: '#8B5CF6',
      action: () => router.push('/profile')
    }
  ];

  const recentAchievements = [
    {
      id: 'html-complete',
      title: 'HTML Fundamentals',
      description: 'Completed all HTML basics',
      date: '2 days ago',
      icon: 'checkmark-circle',
      color: colors.success
    },
    {
      id: 'css-started',
      title: 'CSS Journey Begins',
      description: 'Started learning CSS styling',
      date: '1 day ago',
      icon: 'color-palette',
      color: colors.primary
    }
  ];

  const upcomingMilestones = [
    {
      id: 'js-basics',
      title: 'JavaScript Fundamentals',
      description: 'Learn programming with JavaScript',
      progress: 30,
      estimatedTime: '2 weeks remaining'
    },
    {
      id: 'first-project',
      title: 'First Portfolio Website',
      description: 'Build your personal website',
      progress: 0,
      estimatedTime: '3 weeks remaining'
    }
  ];

  const getProgressPercentage = () => {
    return Math.round((user.completedSteps / user.totalSteps) * 100);
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
        <View style={commonStyles.content}>
          {/* Welcome Header */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.title, { fontSize: 24, textAlign: 'left', marginBottom: 8 }]}>
              Welcome back, {user.name}! 👋
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
              Ready to continue your {user.currentPath} journey?
            </Text>
            
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text style={[commonStyles.text, { fontSize: 14, fontWeight: '600', marginBottom: 4 }]}>
                  Overall Progress
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  {user.completedSteps} of {user.totalSteps} steps
                </Text>
              </View>
              <View style={[commonStyles.rowCenter, { backgroundColor: colors.success, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }]}>
                <Icon name="flame" size={16} style={{ color: 'white', marginRight: 4 }} />
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                  {user.streak} day streak
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

          {/* Quick Actions */}
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Quick Actions
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
            {quickActions.map((action) => (
              <View key={action.id} style={{ width: '48%', marginRight: '2%', marginBottom: 12 }}>
                <Button
                  text=""
                  onPress={action.action}
                  style={[commonStyles.cardSmall, { padding: 16, alignItems: 'center', minHeight: 120 }]}
                >
                  <Icon 
                    name={action.icon as any} 
                    size={32} 
                    style={{ color: action.color, marginBottom: 8 }} 
                  />
                  <Text style={[commonStyles.text, { fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 4 }]}>
                    {action.title}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, textAlign: 'center' }]}>
                    {action.description}
                  </Text>
                </Button>
              </View>
            ))}
          </View>

          {/* Next Milestone */}
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Next Milestone
          </Text>
          
          <View style={[commonStyles.card, { marginBottom: 24 }]}>
            <View style={[commonStyles.row, { alignItems: 'flex-start', marginBottom: 12 }]}>
              <Icon name="flag" size={24} style={{ color: colors.accent, marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 4 }]}>
                  {user.nextMilestone}
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
                  You&apos;re making great progress! Keep going to unlock your next achievement.
                </Text>
              </View>
            </View>
            
            <Button
              text="Continue Learning"
              onPress={() => router.push('/roadmap')}
              style={buttonStyles.primary}
              textStyle={{ color: 'white', fontSize: 16, fontWeight: '600' }}
            />
          </View>

          {/* Recent Achievements */}
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Recent Achievements
          </Text>
          
          {recentAchievements.map((achievement) => (
            <View key={achievement.id} style={[commonStyles.cardSmall, { marginBottom: 12 }]}>
              <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
                <Icon 
                  name={achievement.icon as any} 
                  size={24} 
                  style={{ color: achievement.color, marginRight: 12, marginTop: 2 }} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontSize: 15, fontWeight: '600', marginBottom: 2 }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 13, marginBottom: 4 }]}>
                    {achievement.description}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 11 }]}>
                    {achievement.date}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Upcoming Milestones */}
          <Text style={[commonStyles.subtitle, { marginBottom: 16, marginTop: 8 }]}>
            Upcoming Milestones
          </Text>
          
          {upcomingMilestones.map((milestone) => (
            <View key={milestone.id} style={[commonStyles.cardSmall, { marginBottom: 12 }]}>
              <View style={[commonStyles.row, { alignItems: 'flex-start', marginBottom: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontSize: 15, fontWeight: '600', marginBottom: 2 }]}>
                    {milestone.title}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 13, marginBottom: 8 }]}>
                    {milestone.description}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 11, marginBottom: 8 }]}>
                    {milestone.estimatedTime}
                  </Text>
                </View>
                <View style={[commonStyles.rowCenter, { backgroundColor: colors.border, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 }]}>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                    {milestone.progress}%
                  </Text>
                </View>
              </View>
              
              <View style={[commonStyles.progressBar, { height: 6 }]}>
                <View 
                  style={[
                    commonStyles.progressFill, 
                    { width: `${milestone.progress}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
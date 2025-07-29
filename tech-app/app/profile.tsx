import { Text, View, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

export default function ProfileScreen() {
  console.log('ProfileScreen rendered');
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    location: 'San Francisco, CA',
    stage: 'beginner',
    careerGoal: 'frontend',
    timeCommitment: '3-4',
    learningStyle: 'video',
  });

  const handleSave = () => {
    console.log('Profile saved:', profileData);
    setIsEditing(false);
  };

  const handleBack = () => {
    console.log('Back to dashboard');
    router.back();
  };

  const updateProfileData = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'beginner': return 'Beginner - New to tech';
      case 'intermediate': return 'Intermediate - Some experience';
      case 'job-seeker': return 'Job Seeker - Ready for roles';
      default: return stage;
    }
  };

  const getCareerGoalLabel = (goal: string) => {
    switch (goal) {
      case 'frontend': return 'Frontend Developer';
      case 'backend': return 'Backend Developer';
      case 'fullstack': return 'Full-Stack Developer';
      default: return goal;
    }
  };

  const getTimeCommitmentLabel = (time: string) => {
    switch (time) {
      case '1-2': return '1-2 hours per day';
      case '3-4': return '3-4 hours per day';
      case '5+': return '5+ hours per day';
      default: return time;
    }
  };

  const getLearningStyleLabel = (style: string) => {
    switch (style) {
      case 'video': return 'Video tutorials';
      case 'reading': return 'Reading documentation';
      case 'hands-on': return 'Hands-on projects';
      case 'interactive': return 'Interactive exercises';
      default: return style;
    }
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
        <View style={commonStyles.content}>
          {/* Header */}
          <View style={[commonStyles.row, { marginBottom: 24, alignItems: 'center' }]}>
            <Button
              text=""
              onPress={handleBack}
              style={{ backgroundColor: 'transparent', padding: 8, marginRight: 12 }}
            >
              <Icon name="arrow-back" size={24} style={{ color: colors.text }} />
            </Button>
            <Text style={[commonStyles.title, { flex: 1, textAlign: 'left', marginBottom: 0 }]}>
              Profile
            </Text>
            <Button
              text={isEditing ? "Save" : "Edit"}
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
              style={[buttonStyles.secondary, buttonStyles.small]}
              textStyle={{ color: colors.primary, fontSize: 14, fontWeight: '500' }}
            />
          </View>

          {/* Profile Picture & Basic Info */}
          <View style={[commonStyles.card, { alignItems: 'center', marginBottom: 20 }]}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <Icon name="person" size={40} style={{ color: 'white' }} />
            </View>
            
            {isEditing ? (
              <TextInput
                style={[commonStyles.input, { textAlign: 'center', fontSize: 20, fontWeight: '600' }]}
                value={profileData.name}
                onChangeText={(text) => updateProfileData('name', text)}
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 8 }]}>
                {profileData.name}
              </Text>
            )}
            
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              {getCareerGoalLabel(profileData.careerGoal)} Path
            </Text>
          </View>

          {/* Account Information */}
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Account Information
          </Text>
          
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <View style={[commonStyles.row, { marginBottom: 16, alignItems: 'flex-start' }]}>
              <Icon name="mail" size={20} style={{ color: colors.textSecondary, marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                  Email Address
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[commonStyles.input, { marginBottom: 0 }]}
                    value={profileData.email}
                    onChangeText={(text) => updateProfileData('email', text)}
                    placeholder="Email address"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={[commonStyles.text, { marginBottom: 0 }]}>
                    {profileData.email}
                  </Text>
                )}
              </View>
            </View>
            
            <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
              <Icon name="location" size={20} style={{ color: colors.textSecondary, marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                  Location
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[commonStyles.input, { marginBottom: 0 }]}
                    value={profileData.location}
                    onChangeText={(text) => updateProfileData('location', text)}
                    placeholder="Your location"
                    placeholderTextColor={colors.textSecondary}
                  />
                ) : (
                  <Text style={[commonStyles.text, { marginBottom: 0 }]}>
                    {profileData.location || 'Not specified'}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Learning Preferences */}
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Learning Preferences
          </Text>
          
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <View style={[commonStyles.row, { marginBottom: 16, alignItems: 'flex-start' }]}>
              <Icon name="school" size={20} style={{ color: colors.textSecondary, marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                  Experience Level
                </Text>
                <Text style={[commonStyles.text, { marginBottom: 0 }]}>
                  {getStageLabel(profileData.stage)}
                </Text>
              </View>
            </View>
            
            <View style={[commonStyles.row, { marginBottom: 16, alignItems: 'flex-start' }]}>
              <Icon name="target" size={20} style={{ color: colors.textSecondary, marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                  Career Goal
                </Text>
                <Text style={[commonStyles.text, { marginBottom: 0 }]}>
                  {getCareerGoalLabel(profileData.careerGoal)}
                </Text>
              </View>
            </View>
            
            <View style={[commonStyles.row, { marginBottom: 16, alignItems: 'flex-start' }]}>
              <Icon name="time" size={20} style={{ color: colors.textSecondary, marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                  Time Commitment
                </Text>
                <Text style={[commonStyles.text, { marginBottom: 0 }]}>
                  {getTimeCommitmentLabel(profileData.timeCommitment)}
                </Text>
              </View>
            </View>
            
            <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
              <Icon name="book" size={20} style={{ color: colors.textSecondary, marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                  Learning Style
                </Text>
                <Text style={[commonStyles.text, { marginBottom: 0 }]}>
                  {getLearningStyleLabel(profileData.learningStyle)}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={commonStyles.buttonContainer}>
            <View style={commonStyles.buttonSpacing}>
              <Button
                text="Retake Assessment"
                onPress={() => router.push('/assessment')}
                style={buttonStyles.secondary}
                textStyle={{ color: colors.primary, fontSize: 16, fontWeight: '500' }}
              />
            </View>
            
            <Button
              text="Sign Out"
              onPress={() => {
                console.log('Sign out');
                router.push('/');
              }}
              style={[buttonStyles.secondary, { backgroundColor: 'transparent', borderColor: '#EF4444' }]}
              textStyle={{ color: '#EF4444', fontSize: 16, fontWeight: '500' }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
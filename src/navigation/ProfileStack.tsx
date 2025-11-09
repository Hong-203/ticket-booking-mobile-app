import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen'

export type ProfileStackParamList = {
  ProfileScreen: undefined
  // sau này thêm Detail, Profile, Setting...
}

const Stack = createNativeStackNavigator<ProfileStackParamList>()

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  )
}

export default ProfileStack

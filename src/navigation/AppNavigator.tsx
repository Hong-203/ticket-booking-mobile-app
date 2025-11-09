import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AuthStack from './AuthStack'
import HomeStack from './HomeStack'
import ProfileStack from './ProfileStack'
import CinemaScreen from '../screens/CinemaScreen'
import MovieStack, { MovieStackParamList } from './MovieStack'
import { NavigatorScreenParams } from '@react-navigation/native'

export type RootStackParamList = {
  Auth: undefined
  App: undefined
  Profile: undefined
  CinemaScreen: undefined
  Movie: NavigatorScreenParams<MovieStackParamList>
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null)

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user')
        console.log('storedUserr', storedUser)
        const user = storedUser ? JSON.parse(storedUser) : null
        setInitialRoute(user?.token ? 'App' : 'Auth')
      } catch (error) {
        console.error('Lỗi lấy user:', error)
        setInitialRoute('Auth')
      }
    }

    checkLogin()
  }, [])

  if (!initialRoute) return null // Hoặc splash screen

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="App" component={HomeStack} />
      <Stack.Screen name="Profile" component={ProfileStack} />
      <Stack.Screen name="CinemaScreen" component={CinemaScreen} />
      <Stack.Screen name="Movie" component={MovieStack} />
    </Stack.Navigator>
  )
}

export default AppNavigator

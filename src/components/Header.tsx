import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'

interface Tab {
  id: string
  title: string
}

interface HeaderProps {
  activeTab: 'now_showing' | 'coming_soon'
  setActiveTab: (value: 'now_showing' | 'coming_soon') => void
}

const Header: React.FC<HeaderProps> = ({
  activeTab = 'now_showing',
  setActiveTab = () => {}
}) => {
  const tabs: Tab[] = [
    { id: 'now_showing', title: 'Đang chiếu' },
    { id: 'coming_soon', title: 'Sắp chiếu' }
  ]
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const handleProfile = () => {
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'Profile' }]
    })
  }
  return (
    <SafeAreaView className="bg-slate-900">
      <View style={{ height: 30, backgroundColor: 'black' }} />
      {/* Header chính */}
      <View className="bg-gradient-to-r from-slate-900 to-slate-800 px-2 pb-1">
        <View className="flex-row items-center justify-between py-2">
          <TouchableOpacity
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg"
            onPress={() => handleProfile()}
          >
            <Image
              source={{
                uri: 'https://img.freepik.com/premium-vector/cinema-movie-background-popcorn-filmstrip-clapboard-tickets-movie-time-background_41737-248.jpg'
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Logo App */}
          <View className="flex-1 items-center">
            <View className="bg-gradient-to-r from-fuchsia-500 via-red-500 to-yellow-500 px-2 py-1 rounded-xl shadow-lg">
              <Text className="text-white font-bold text-base tracking-widest uppercase shadow-sm">
                🎬 Cinezone 🍿
              </Text>
            </View>
          </View>

          {/* Menu Button */}
          <TouchableOpacity className="w-9 h-9 items-center justify-center bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
            <View className="space-y-1">
              <View className="w-5 h-0.5 bg-amber-400 rounded-full"></View>
              <View className="w-5 h-0.5 bg-amber-400 rounded-full"></View>
              <View className="w-5 h-0.5 bg-amber-400 rounded-full"></View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider Line */}
        <View className="border-t border-yellow-400 border-dashed" />

        {/* Dòng 3: Navigation Tabs */}
        <View className="flex-row mt-2">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() =>
                setActiveTab(tab.id as 'now_showing' | 'coming_soon')
              }
              className={`flex-1 py-1 px-2 rounded-lg mx-0.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg'
                  : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-400'
                }`}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Gradient Border Bottom */}
      <View className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></View>
    </SafeAreaView>
  )
}

export default Header

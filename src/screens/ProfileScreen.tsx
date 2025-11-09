import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Button
} from 'react-native'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  WalletIcon,
  CogIcon,
  PencilIcon,
  CameraIcon
} from 'react-native-heroicons/outline'
import { RootStackParamList } from '../navigation/AppNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { getUserProfile } from '../redux/User/userActions'
import { useAppSelector } from '../redux/hooks'
import { RootState } from '../redux/store'

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch()
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const { profile, loading } = useAppSelector((state: RootState) => state.users)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setToken(parsedUser.token)
        }
        await dispatch<any>(getUserProfile())
      } catch (error) {
        console.error('Lỗi lấy token:', error)
      }
    }

    loadToken()
  }, [])

  const handleHome = () => {
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'App' }]
    })
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (!profile) return null

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-indigo-100 to-purple-100">
      {/* Header */}
      <View className="px-6 pt-12 pb-8">
        <View className="flex-row justify-between items-start mb-6">
          <Text className="text-3xl font-bold text-purple-800">Hồ sơ</Text>
          <TouchableOpacity className="p-2 bg-purple-200 rounded-full">
            <CogIcon size={20} color="#6B21A8" />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-28 h-28 bg-purple-500 rounded-full items-center justify-center shadow-xl">
              {profile.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  className="w-28 h-28 rounded-full"
                />
              ) : (
                <Text className="text-white text-3xl font-bold">
                  {profile.full_name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200">
              <CameraIcon size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-semibold text-purple-900 mt-3">
            {profile.full_name}
          </Text>

          <View className="flex-row gap-2 mt-2">
            <View
              className={`px-3 py-1 rounded-full ${
                profile.is_active ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  profile.is_active ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {profile.is_active ? 'Hoạt động' : 'Không hoạt động'}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${
                profile.account_type === 'admin'
                  ? 'bg-purple-200'
                  : 'bg-blue-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  profile.account_type === 'admin'
                    ? 'text-purple-900'
                    : 'text-blue-900'
                }`}
              >
                {profile.account_type.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Balance */}
      <View className="mx-6 mb-4">
        <View className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-sm opacity-90">
                Số dư tài khoản
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {formatCurrency(profile.account_balance)}
              </Text>
            </View>
            <View className="bg-white bg-opacity-20 p-3 rounded-full">
              <WalletIcon size={24} color="white" />
            </View>
          </View>
        </View>
      </View>

      {/* Personal Info */}
      <View className="bg-white mx-6 rounded-2xl shadow-md">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
          <Text className="text-lg font-semibold text-purple-800">
            Thông tin cá nhân
          </Text>
          <TouchableOpacity className="p-2 bg-purple-50 rounded-full">
            <PencilIcon size={16} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        <View className="p-4 space-y-4">
          {[
            {
              label: 'Email',
              value: profile.email,
              icon: <EnvelopeIcon size={18} color="#6366F1" />,
              bg: 'bg-indigo-100'
            },
            {
              label: 'Số điện thoại',
              value: profile.phone_number,
              icon: <PhoneIcon size={18} color="#10B981" />,
              bg: 'bg-emerald-100'
            },
            {
              label: 'Địa chỉ',
              value: profile.address,
              icon: <MapPinIcon size={18} color="#F59E0B" />,
              bg: 'bg-amber-100'
            },
            {
              label: 'Giới tính',
              value: profile.gender === 'male' ? 'Nam' : 'Nữ',
              icon: <UserIcon size={18} color="#A855F7" />,
              bg: 'bg-purple-100'
            },
            {
              label: 'Ngày sinh',
              value: profile.dob ? formatDate(profile.dob) : 'Chưa cập nhật',
              icon: <CalendarIcon size={18} color="#EC4899" />,
              bg: 'bg-pink-100'
            }
          ].map((item, idx) => (
            <View key={idx} className="flex-row items-center">
              <View className={`p-2 rounded-full mr-3 ${item.bg}`}>
                {item.icon}
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">{item.label}</Text>
                <Text className="text-gray-900 font-medium">{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Account Detail */}
      <View className="bg-white mx-6 mt-4 rounded-2xl shadow-md mb-8">
        <View className="p-4 border-b border-gray-100">
          <Text className="text-lg font-semibold text-purple-800">
            Thông tin tài khoản
          </Text>
        </View>
        <View className="p-4 space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">ID tài khoản</Text>
            <Text className="text-gray-900 font-mono text-xs">
              {profile.id.slice(0, 8)}...
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Ngày tạo</Text>
            <Text className="text-gray-900">
              {formatDate(profile.created_at)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Cập nhật lần cuối</Text>
            <Text className="text-gray-900">
              {formatDate(profile.updated_at)}
            </Text>
          </View>
        </View>
      </View>
      <Button title="Quay về trang chủ" onPress={() => handleHome()} />
    </ScrollView>
  )
}

export default ProfileScreen

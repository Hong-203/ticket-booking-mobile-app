import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert
} from 'react-native'
import {
  NativeStackNavigationProp,
  NativeStackScreenProps
} from '@react-navigation/native-stack'
import { AuthStackParamList } from '../navigation/AuthStack'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import { login } from '../redux/User/userActions'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/AppNavigator'

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

const { width, height } = Dimensions.get('window')

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const handleLogin = async () => {
    const payload = { identifier, password }
    try {
      const user = await dispatch<any>(login(payload))
      if (user?.token) {
        rootNavigation.reset({
          index: 0,
          routes: [{ name: 'App' }]
        })
      } else {
        Alert.alert('Lỗi', 'Đăng nhập không thành công')
      }
    } catch (error) {
      const err = error as Error
      Alert.alert('Lỗi', err.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1489599243320-b6de50b06151?ixlib=rb-4.0.3&auto=format&fit=crop'
      }}
      className="flex-1"
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.95)']}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Logo/Title Section */}
          <View className="items-center mb-8">
            <View className="bg-red-600 rounded-full w-16 h-16 items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold">🎬</Text>
            </View>
            <Text className="text-white text-3xl font-bold mb-1">Cinezone</Text>
            <Text className="text-gray-300 text-base">
              Trải nghiệm điện ảnh tuyệt vời
            </Text>
          </View>

          {/* Login Form - 60% of screen height */}
          <View
            style={{ maxHeight: height * 0.6 }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          >
            <Text className="text-white text-xl font-bold text-center mb-6">
              Đăng nhập
            </Text>

            <View className="space-y-4">
              {/* Email Input */}
              <View className="relative">
                <Text className="text-gray-300 text-xs mb-1 ml-1">
                  Email hoặc số điện thoại
                </Text>
                <TextInput
                  className="bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-3 text-white text-base"
                  placeholder="Nhập email hoặc số điện thoại"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={setIdentifier}
                  value={identifier}
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View className="relative">
                <Text className="text-gray-300 text-xs mb-1 ml-1">
                  Mật khẩu
                </Text>
                <TextInput
                  className="bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-3 text-white text-base"
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry
                />
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end">
                <Text className="text-red-400 text-xs">Quên mật khẩu?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg py-3 mt-3"
              >
                <LinearGradient
                  colors={['#DC2626', '#B91C1C']}
                  className="rounded-lg py-3"
                >
                  <Text className="text-white text-base font-bold text-center">
                    Đăng nhập
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-600" />
                <Text className="text-gray-400 px-3 text-sm">hoặc</Text>
                <View className="flex-1 h-px bg-gray-600" />
              </View>

              {/* Social Login Buttons */}
              <View className="space-y-2">
                <TouchableOpacity className="bg-gray-800/60 border border-gray-600 rounded-lg py-3 flex-row items-center justify-center">
                  <Text className="text-white text-sm ml-2">
                    Đăng nhập với Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-blue-600/80 border border-blue-500 rounded-lg py-3 flex-row items-center justify-center">
                  <Text className="text-white text-sm ml-2">
                    Đăng nhập với Facebook
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-300 text-base">Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-red-400 text-base font-semibold">
                Đăng ký ngay
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cinema Decorative Elements */}
          <View className="absolute top-20 left-4 opacity-20">
            <Text className="text-yellow-400 text-6xl">🍿</Text>
          </View>
          <View className="absolute top-32 right-8 opacity-20">
            <Text className="text-red-400 text-4xl">🎭</Text>
          </View>
          <View className="absolute bottom-32 left-8 opacity-20">
            <Text className="text-blue-400 text-5xl">🎪</Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default LoginScreen

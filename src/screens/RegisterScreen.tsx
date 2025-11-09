import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions
} from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { AuthStackParamList } from '../navigation/AuthStack'

type RegisterScreenProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>

const { width, height } = Dimensions.get('window')

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenProp>()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const handleRegister = () => {
    if (!identifier || !password || !confirmPassword || !fullName) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp')
      return
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    const payload = {
      username: fullName,
      identifier: identifier,
      password: password
    }

    Alert.alert('Đăng ký thành công', 'Chào mừng bạn đến với CinemaMax!', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ])
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
          {/* Title - Làm nhỏ hơn */}
          <View className="items-center mb-4">
            <View className="bg-red-600 rounded-full w-12 h-12 items-center justify-center mb-2">
              <Text className="text-white text-lg font-bold">🎬</Text>
            </View>
            <Text className="text-white text-2xl font-bold mb-1">CINEZONE</Text>
            <Text className="text-gray-300 text-sm">
              Tạo tài khoản để trải nghiệm điện ảnh
            </Text>
          </View>

          {/* Register Form - Làm lớn hơn */}
          <View
            style={{ maxHeight: height * 0.75 }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-8 border border-gray-700/50"
          >
            <Text className="text-white text-xl font-bold text-center mb-6">
              Đăng ký tài khoản
            </Text>

            <View className="space-y-4">
              {/* Full Name Input */}
              <View>
                <Text className="text-gray-300 text-sm mb-2 ml-1">
                  Họ và tên *
                </Text>
                <TextInput
                  className="bg-gray-800/80 border border-gray-600 rounded-lg px-4 py-4 text-white text-base"
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              {/* Identifier Input (email or phone) */}
              <View>
                <Text className="text-gray-300 text-sm mb-2 ml-1">
                  Email hoặc số điện thoại *
                </Text>
                <TextInput
                  className="bg-gray-800/80 border border-gray-600 rounded-lg px-4 py-4 text-white text-base"
                  placeholder="example@gmail.com / 0912345678"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={identifier}
                  onChangeText={setIdentifier}
                />
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-300 text-sm mb-2 ml-1">
                  Mật khẩu *
                </Text>
                <TextInput
                  className="bg-gray-800/80 border border-gray-600 rounded-lg px-4 py-4 text-white text-base"
                  placeholder="Ít nhất 6 ký tự"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Confirm Password Input */}
              <View>
                <Text className="text-gray-300 text-sm mb-2 ml-1">
                  Xác nhận mật khẩu *
                </Text>
                <TextInput
                  className="bg-gray-800/80 border border-gray-600 rounded-lg px-4 py-4 text-white text-base"
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg mt-6"
              >
                <LinearGradient
                  colors={['#DC2626', '#B91C1C']}
                  className="rounded-lg py-4"
                >
                  <Text className="text-white text-lg font-bold text-center">
                    Tạo tài khoản
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Redirect */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-300 text-base">Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-red-400 text-base font-semibold">
                Đăng nhập ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default RegisterScreen

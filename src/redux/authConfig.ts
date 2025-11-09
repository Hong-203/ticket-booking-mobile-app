import AsyncStorage from '@react-native-async-storage/async-storage'

export const getAuthConfig = async () => {
  const token = await AsyncStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

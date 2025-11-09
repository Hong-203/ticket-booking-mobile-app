import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ScrollView
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import ScreenLayout from '../components/ScreenLayout'
import MovieSlider from '../components/MovieSlider'
import AdSlider from '../components/AdSlider'
import { getAllMovies } from '../redux/Movie/movieActions'
import { RootState } from '../redux/store'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import StaggeredList from '../components/StaggeredList'
import SnackList from '../components/SnackList'
import { getAllItems } from '../redux/Items/concessionItemsActions'

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const dispatch = useAppDispatch()
  const { movieList, loading } = useAppSelector(
    (state: RootState) => state.movie
  )
  const { concessionItemsList } = useAppSelector(
    (state) => state.concessionItems
  )

  const [activeTab, setActiveTab] = React.useState<
    'now_showing' | 'coming_soon'
  >('now_showing')

  useEffect(() => {
    dispatch(getAllItems())
    dispatch(getAllMovies({ status: activeTab }))
  }, [dispatch, activeTab])

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user')
      await AsyncStorage.removeItem('token')
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      })
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng xuất thất bại')
    }
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://www.cgv.vn/skin/frontend/cgv/default/images/bg_c_bricks.png'
      }}
      style={{ flex: 1 }}
      resizeMode="repeat"
    >
      <ScreenLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <AdSlider />
          <Text className="text-2xl font-extrabold text-white mb-1 text-center">
            {activeTab === 'now_showing' ? 'Phim đang chiếu' : 'Phim sắp chiếu'}
          </Text>
          <MovieSlider movies={movieList} />
          <View className="px-4 mt-6 mb-6">
            <TouchableOpacity
              className="bg-yellow-500 py-3 px-4 rounded-xl shadow-md"
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CinemaScreen')}
            >
              <Text className="text-white text-center font-bold text-base">
                🎬 Khám phá các rạp chiếu gần bạn
              </Text>
            </TouchableOpacity>
          </View>

          <StaggeredList />
          <SnackList data={concessionItemsList} />
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenLayout>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  logoutContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  button: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
})

export default HomeScreen

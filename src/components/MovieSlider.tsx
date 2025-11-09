import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Movie } from '../types/movie'
import {
  CompositeNavigationProp,
  useNavigation
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { MovieStackParamList } from '../navigation/MovieStack'

interface MovieSliderProps {
  movies: Movie[]
}

const { width: screenWidth } = Dimensions.get('window')
const itemMargin = 10
const itemWidth = screenWidth * 0.65
const snapInterval = itemWidth + itemMargin * 2
const sideSpacing = (screenWidth - itemWidth) / 2

const MovieSlider: React.FC<MovieSliderProps> = ({ movies }) => {
  const scrollX = useRef(new Animated.Value(0)).current
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / itemWidth)
    setCurrentIndex(index)
  }
  type RootNav = NativeStackNavigationProp<RootStackParamList>
  type MovieNav = NativeStackNavigationProp<MovieStackParamList, 'MovieDetail'>

  const navigation = useNavigation<CompositeNavigationProp<MovieNav, RootNav>>()

  const handleMovieDetail = (id: string) => {
    navigation.navigate('Movie', {
      screen: 'MovieDetail',
      params: { id }
    })
  }
  return (
    <View className="flex-1">
      {/* Movie Slider */}
      <Animated.ScrollView
        horizontal
        snapToInterval={snapInterval}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: sideSpacing - itemMargin
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {movies.map((movie, index) => {
          const inputRange = [
            (index - 1) * snapInterval,
            index * snapInterval,
            (index + 1) * snapInterval
          ]

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp'
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp'
          })

          return (
            <Animated.View
              key={movie.id}
              style={{
                width: itemWidth,
                marginHorizontal: itemMargin,
                transform: [{ scale }],
                opacity
              }}
            >
              <View className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Movie Poster */}
                <View className="relative">
                  <Image
                    source={{ uri: movie.image_path }}
                    className="w-full h-80"
                    resizeMode="cover"
                  />

                  {/* Rating Badge */}
                  <View className="absolute top-4 left-4 bg-amber-500 px-3 py-1 rounded-full flex-row items-center">
                    <Ionicons name="star" size={14} color="white" />
                    <Text className="text-white font-bold text-sm ml-1">
                      {movie.rating}
                    </Text>
                  </View>

                  {/* Play Button */}
                  {/* <TouchableOpacity className="absolute inset-0 items-center justify-center">
                    <View className="bg-black/50 w-16 h-16 rounded-full items-center justify-center">
                      <Ionicons
                        name="play"
                        size={24}
                        color="white"
                        style={{ marginLeft: 2 }}
                      />
                    </View>
                  </TouchableOpacity> */}
                </View>

                <View className="p-4">
                  {/* Title & Genre in one line */}
                  <View className="flex-row items-center justify-between mb-3">
                    <Text
                      className="text-white font-bold"
                      style={{ fontSize: 15, flexShrink: 1 }}
                      numberOfLines={1}
                    >
                      {movie.name}
                    </Text>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View className="flex-row flex-wrap ml-2">
                        {movie.genres.map((genre, idx) => (
                          <View
                            key={idx}
                            className="bg-slate-700 px-2 py-[2px] rounded-md mr-1"
                          >
                            <Text className="text-amber-400 text-[10px] font-medium">
                              {genre.genre}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  {/* Release Date & Duration in one line */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#fbbf24"
                      />
                      <Text className="text-slate-300 text-sm ml-2">
                        {formatDate(movie.release_date)}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={16} color="#fbbf24" />
                      <Text className="text-slate-300 text-sm ml-2">
                        {movie.duration}
                      </Text>
                    </View>
                  </View>

                  {/* Book Ticket Button */}
                  <TouchableOpacity
                    className="bg-gradient-to-r from-amber-500 to-orange-500 py-3 px-6 rounded-xl shadow-lg"
                    onPress={() => handleMovieDetail(movie.id)}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="ticket-outline" size={18} color="white" />
                      <Text className="text-white font-bold text-base ml-2">
                        Đặt vé ngay
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )
        })}
      </Animated.ScrollView>

      {/* Pagination Dots */}
      {/* <View className="flex-row justify-center items-center py-4 space-x-2">
        {movies.map((_, index) => (
          <TouchableOpacity
            key={index}
            className={`h-2 rounded-full ${
              index === currentIndex ? 'bg-amber-500 w-8' : 'bg-slate-600 w-2'
            }`}
          />
        ))}
      </View> */}
    </View>
  )
}

export default MovieSlider

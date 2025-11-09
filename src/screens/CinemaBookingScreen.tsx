import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MovieStackParamList } from '../navigation/MovieStack'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { RootState } from '../redux/store'
import { getSeatAvailable } from '../redux/Movie/movieActions'
import { createBooking } from '../redux/Booking/bookingActions'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { detailShowTime } from '../redux/ShowTime/showTimeActions'

interface Seat {
  id: string
  name: string
  description: string
  status: 'empty' | 'booked' | 'pending'
  created_at: string
  updated_at: string
  user_id: string | null
}

const CinemaBookingScreen = () => {
  const [seats, setSeats] = useState<Seat[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [orientation, setOrientation] = useState('portrait')
  const [pricePerSeat, setPricePerSeat] = useState<number | null>(null)

  type MovieShowtimeRouteProp = RouteProp<
    MovieStackParamList,
    'MovieBookingSeat'
  >
  const route = useRoute<MovieShowtimeRouteProp>()
  const { hall_id, showtime_id, movie_id } = route.params
  const { seatList, loading } = useAppSelector(
    (state: RootState) => state.movie
  )
  const { showtimeDetails } = useAppSelector(
    (state: RootState) => state.showTime
  )

  const dispatch = useAppDispatch()
  useEffect(() => {
    fetchShowtimeData()
    if (showtime_id) {
      dispatch(detailShowTime(showtime_id))
    }
  }, [movie_id, hall_id, showtime_id])

  useEffect(() => {
    if (showtimeDetails?.price_per_seat !== undefined) {
      setPricePerSeat(showtimeDetails.price_per_seat)
    }
  }, [showtimeDetails])

  const fetchShowtimeData = () => {
    if (movie_id && hall_id && showtime_id) {
      dispatch(
        getSeatAvailable(
          `movie_id=${movie_id}&hall_id=${hall_id}&showtime_id=${showtime_id}`
        )
      )
    }
  }

  useEffect(() => {
    loadUserData()
    setSeats(seatList)

    const updateLayout = () => {
      const { width, height } = Dimensions.get('screen')
      setOrientation(width > height ? 'landscape' : 'portrait')
    }

    const subscription = Dimensions.addEventListener('change', updateLayout)
    updateLayout()

    return () => {
      subscription?.remove()
    }
  }, [])

  const loadUserData = async () => {
    try {
      const storedUserString = await AsyncStorage.getItem('user')

      if (storedUserString) {
        const storedUser = JSON.parse(storedUserString)
        const userId = storedUser.id
        setCurrentUserId(userId)
      } else {
        console.warn('No user found in AsyncStorage')
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) {
      return 'bg-blue-500'
    }

    switch (seat.status) {
      case 'empty':
        return 'bg-gray-300'
      case 'booked':
        return 'bg-red-500'
      case 'pending':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getSeatTextColor = (seat: Seat) => {
    if (seat.status === 'empty' || selectedSeats.includes(seat.id)) {
      return 'text-black'
    }
    return 'text-white'
  }

  const canSelectSeat = (seat: Seat) => {
    if (seat.status === 'booked' && seat.user_id !== currentUserId) {
      return false
    }
    if (seat.status === 'pending' && seat.user_id !== currentUserId) {
      return false
    }
    return true
  }

  const handleSeatPress = (seat: Seat) => {
    if (!canSelectSeat(seat)) {
      Alert.alert('Thông báo', 'Ghế này không thể chọn')
      return
    }
    if (
      seat.user_id === currentUserId &&
      (seat.status === 'booked' || seat.status === 'pending')
    ) {
      Alert.alert('Hủy ghế', `Bạn có muốn hủy ghế ${seat.name}?`, [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: () => cancelSeat(seat.id),
          style: 'destructive'
        }
      ])
      return
    }

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats((prev) => prev.filter((id) => id !== seat.id))
    } else {
      setSelectedSeats((prev) => [...prev, seat.id])
    }
  }

  const cancelSeat = (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId
          ? { ...seat, status: 'empty' as const, user_id: null }
          : seat
      )
    )
    setSelectedSeats((prev) => prev.filter((id) => id !== seatId))
  }

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một ghế')
      return
    }

    if (pricePerSeat === null) {
      Alert.alert('Thông báo', 'Không có giá ghế. Vui lòng thử lại sau.')
      return
    }

    const seat_total_price = selectedSeats.length * pricePerSeat
    Alert.alert(
      'Xác nhận đặt ghế',
      `Bạn có muốn đặt ${
        selectedSeats.length
      } ghế với tổng giá ${seat_total_price.toLocaleString()} VND?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đặt ghế',
          onPress: async () => {
            const data = {
              seat_ids: selectedSeats, // chỉ gửi id
              movie_id,
              hall_id,
              showtime_id
            }

            try {
              const result = await dispatch(createBooking(data))
              const bookingIds = result.map((item: any) => item.id)
              navigation.navigate('Movie', {
                screen: 'ConcessionItems',
                params: {
                  bookingIds,
                  seat_total_price
                }
              })
            } catch (error) {
              console.error('Lỗi khi đặt ghế:', error)
              Alert.alert('Lỗi', 'Không thể đặt ghế. Vui lòng thử lại.')
            }
          }
        }
      ]
    )
  }

  const bookSeats = () => {
    setSeats((prev) =>
      prev.map((seat) =>
        selectedSeats.includes(seat.id)
          ? { ...seat, status: 'pending' as const, user_id: currentUserId }
          : seat
      )
    )
    setSelectedSeats([])
    Alert.alert('Thành công', 'Đặt ghế thành công!')
  }

  const renderSeatRow = (rowLetter: string, startIndex: number) => {
    const rowSeats = seats.slice(startIndex, startIndex + 24)
    const isDoubleRow = rowLetter === 'L'
    const isLandscape = orientation === 'landscape'

    // Responsive seat size - smaller for 24 seats
    const seatSize = isLandscape
      ? isDoubleRow
        ? 'w-6 h-5'
        : 'w-5 h-5'
      : isDoubleRow
      ? 'w-5 h-5'
      : 'w-4 h-5'

    return (
      <View
        key={rowLetter}
        className="flex-row justify-center items-center mb-0.5"
      >
        <Text
          className={`text-xs font-bold text-gray-300 ${
            isLandscape ? 'w-6' : 'w-5'
          } text-center mr-1`}
        >
          {rowLetter}
        </Text>
        <View className="flex-row items-center">
          {/* Ghế 1-12 */}
          <View className="flex-row">
            {rowSeats.slice(0, 12).map((seat) => (
              <TouchableOpacity
                key={seat.id}
                onPress={() => handleSeatPress(seat)}
                className={`
                  ${getSeatColor(seat)}
                  ${seatSize}
                  mx-0.5 rounded justify-center items-center
                  ${!canSelectSeat(seat) ? 'opacity-50' : ''}
                `}
                disabled={
                  !canSelectSeat(seat) && seat.user_id !== currentUserId
                }
              >
                <Text
                  className={`${
                    isLandscape ? 'text-[9px]' : 'text-[8px]'
                  } font-bold ${getSeatTextColor(seat)}`}
                >
                  {seat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dấu phân cách giữa */}
          <View className="mx-2">
            <Text className="text-gray-500 text-lg font-bold">|</Text>
          </View>

          {/* Ghế 13-24 */}
          <View className="flex-row">
            {rowSeats.slice(12, 24).map((seat) => (
              <TouchableOpacity
                key={seat.id}
                onPress={() => handleSeatPress(seat)}
                className={`
                  ${getSeatColor(seat)}
                  ${seatSize}
                  mx-0.5 rounded justify-center items-center
                  ${!canSelectSeat(seat) ? 'opacity-50' : ''}
                `}
                disabled={
                  !canSelectSeat(seat) && seat.user_id !== currentUserId
                }
              >
                <Text
                  className={`${
                    isLandscape ? 'text-[9px]' : 'text-[8px]'
                  } font-bold ${getSeatTextColor(seat)}`}
                >
                  {seat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    )
  }

  const isLandscape = orientation === 'landscape'

  if (isLandscape) {
    // Layout ngang - 2 cột
    return (
      <View className="flex-1 bg-gray-900">
        <StatusBar hidden />
        <View className="flex-row flex-1">
          {/* Cột trái - Sơ đồ ghế */}
          <View className="flex-1 px-1 py-2">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Screen */}
              <View className="mb-3">
                <View className="bg-white h-1.5 rounded-full mx-4 mb-1" />
                <Text className="text-white text-center text-sm font-bold">
                  MÀN HÌNH
                </Text>
              </View>

              {/* Seats */}
              <View className="mb-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const rowLetter = String.fromCharCode(65 + i)
                  const startIndex = i * 24
                  return renderSeatRow(rowLetter, startIndex)
                })}
              </View>
            </ScrollView>
          </View>

          {/* Cột phải - Thông tin và điều khiển */}
          <View className="w-48 bg-gray-800 p-3">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Legend */}
              <View className="mb-4">
                <Text className="text-white font-bold text-sm mb-2">
                  Chú thích:
                </Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 bg-gray-300 rounded mr-2" />
                    <Text className="text-white text-xs">Trống</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 bg-yellow-500 rounded mr-2" />
                    <Text className="text-white text-xs">Đang chờ</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 bg-red-500 rounded mr-2" />
                    <Text className="text-white text-xs">Đã đặt</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 bg-blue-500 rounded mr-2" />
                    <Text className="text-white text-xs">Đang chọn</Text>
                  </View>
                </View>
              </View>

              {/* Selected seats */}
              {selectedSeats.length > 0 && (
                <View className="bg-gray-700 p-3 rounded-lg mb-4">
                  <Text className="text-white font-bold text-sm mb-2">
                    Ghế đã chọn ({selectedSeats.length}):
                  </Text>
                  <ScrollView style={{ maxHeight: 100 }}>
                    <Text className="text-blue-400 text-xs">
                      {selectedSeats
                        .map((seatId) => {
                          const seat = seats.find((s) => s.id === seatId)
                          return seat?.name
                        })
                        .join(', ')}
                    </Text>
                  </ScrollView>
                </View>
              )}

              {/* Action buttons */}
              {selectedSeats.length > 0 && (
                <View className="space-y-2 mb-4">
                  <TouchableOpacity
                    onPress={() => setSelectedSeats([])}
                    className="bg-gray-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-bold text-center text-sm">
                      Hủy chọn
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={confirmBooking}
                    className="bg-green-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-bold text-center text-sm">
                      Đặt ghế
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* User info */}
              <View className="bg-gray-700 p-3 rounded-lg">
                <Text className="text-gray-400 text-xs mt-1">
                  24 ghế/hàng, 12 bên trái | 12 bên phải
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-900 px-1 py-4">
      {/* Screen */}
      <View className="mb-6">
        <View className="bg-white h-1.5 rounded-full mx-6 mb-2" />
        <Text className="text-white text-center text-base font-bold">
          MÀN HÌNH
        </Text>
        <Text className="text-gray-400 text-center text-xs">Hướng ngồi</Text>
      </View>

      {/* Legend - Compact */}
      <View className="flex-row justify-center mb-4 flex-wrap">
        <View className="flex-row items-center mx-1 mb-1">
          <View className="w-3 h-3 bg-gray-300 rounded mr-1" />
          <Text className="text-white text-xs">Trống</Text>
        </View>
        <View className="flex-row items-center mx-1 mb-1">
          <View className="w-3 h-3 bg-yellow-500 rounded mr-1" />
          <Text className="text-white text-xs">Chờ</Text>
        </View>
        <View className="flex-row items-center mx-1 mb-1">
          <View className="w-3 h-3 bg-red-500 rounded mr-1" />
          <Text className="text-white text-xs">Đặt</Text>
        </View>
        <View className="flex-row items-center mx-1 mb-1">
          <View className="w-3 h-3 bg-blue-500 rounded mr-1" />
          <Text className="text-white text-xs">Chọn</Text>
        </View>
      </View>

      {/* Seats - Compact */}
      <View className="mb-4">
        {Array.from({ length: 12 }, (_, i) => {
          const rowLetter = String.fromCharCode(65 + i)
          const startIndex = i * 24
          return renderSeatRow(rowLetter, startIndex)
        })}
      </View>

      {/* Selected seats info */}
      {selectedSeats.length > 0 && (
        <View className="bg-gray-800 p-3 rounded-lg mb-4">
          <Text className="text-white font-bold text-sm mb-2">
            Ghế đã chọn ({selectedSeats.length}):
          </Text>
          <ScrollView style={{ maxHeight: 60 }}>
            <Text className="text-blue-400 text-xs">
              {selectedSeats
                .map((seatId) => {
                  const seat = seats.find((s) => s.id === seatId)
                  return seat?.name
                })
                .join(', ')}
            </Text>
          </ScrollView>
        </View>
      )}

      {/* Action buttons */}
      {selectedSeats.length > 0 && (
        <View className="flex-row justify-center space-x-4 mb-4">
          <TouchableOpacity
            onPress={() => setSelectedSeats([])}
            className="bg-gray-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold text-sm">Hủy chọn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={confirmBooking}
            className="bg-green-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold text-sm">Đặt ghế</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* User info */}
      <View className="bg-gray-800 p-3 rounded-lg">
        <Text className="text-gray-400 text-xs mt-1">
          💡 Xoay ngang để có trải nghiệm tốt hơn (24 ghế/hàng)
        </Text>
      </View>
    </ScrollView>
  )
}

export default CinemaBookingScreen

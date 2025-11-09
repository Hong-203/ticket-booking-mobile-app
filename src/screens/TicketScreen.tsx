import React, { useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TicketData } from '../types/ticket'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MovieStackParamList } from '../navigation/MovieStack'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { RootState } from '../redux/store'
import { getTicketById } from '../redux/Ticket/ticketActions'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'

const TicketScreen: React.FC = () => {
  // Sample data from JSON

  const dispatch = useAppDispatch()
  const { ticketDetails: ticketData, loading } = useAppSelector(
    (state: RootState) => state.ticket
  )

  type MovieRouteProp = RouteProp<MovieStackParamList, 'Ticket'>
  const route = useRoute<MovieRouteProp>()
  const { ticket_id } = route.params
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  useEffect(() => {
    dispatch(getTicketById(ticket_id))
  }, [ticket_id, dispatch])

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(typeof price === 'string' ? parseFloat(price) : price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handlePayment = () => {
    navigation.navigate('Movie', {
      screen: 'Payment',
      params: {
        ticket_id
      }
    })
  }

  if (!ticketData) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Đang tải vé...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-sm">
        <TouchableOpacity className="p-2">
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Vé Xem Phim</Text>
        <TouchableOpacity className="p-2">
          <Ionicons name="share-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Ticket Card */}
        <View className="mx-4 mt-4 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Movie Header */}
          <View className="flex-row p-4 bg-white rounded-2xl shadow-md">
            <Image
              source={{ uri: ticketData.movie.image_path }}
              className="w-20 h-28 rounded-lg"
              resizeMode="cover"
            />

            <View className="flex-1 ml-4">
              <Text className="text-gray-900 text-xl font-bold mb-1">
                {ticketData.movie.name}
              </Text>

              <View className="flex-row items-center mb-1">
                <Ionicons name="star" size={16} color="#facc15" />{' '}
                {/* vàng đậm hơn */}
                <Text className="text-yellow-600 ml-1 font-medium">
                  {ticketData.movie.rating}
                </Text>
              </View>

              <Text className="text-gray-700 text-sm mb-1">
                {ticketData.movie.top_cast}
              </Text>

              <View className="flex-row items-center mt-2">
                <View className="bg-gray-200 px-2 py-1 rounded-full">
                  <Text className="text-gray-800 text-xs font-medium">
                    {ticketData.showtime.show_type}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Ticket Details */}
          <View className="p-4">
            {/* Date & Time */}
            <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">Ngày chiếu</Text>
                <Text className="text-gray-900 font-semibold">
                  {formatDate(ticketData.showtime.showtime_date)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">Giờ chiếu</Text>
                <Text className="text-gray-900 font-semibold">
                  {ticketData.showtime.movie_start_time}
                </Text>
              </View>
            </View>

            {/* Hall & Seat */}
            <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">Phòng chiếu</Text>
                <Text className="text-gray-900 font-semibold">
                  Phòng {ticketData.hall.name}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">Ghế</Text>
                <Text className="text-gray-900 font-semibold">
                  {ticketData.seats.map((seat) => seat.seat.name).join(', ')}
                </Text>
              </View>
            </View>

            {/* Concessions */}
            {ticketData.concessions.length > 0 && (
              <View className="mb-4 pb-4 border-b border-gray-100">
                <Text className="text-gray-500 text-sm mb-2">
                  Đồ ăn & Nước uống
                </Text>
                {ticketData.concessions.map((concession, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between mb-2"
                  >
                    <View className="flex-1">
                      <Text className="text-gray-900 font-medium">
                        {concession.item.name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Số lượng: {concession.quantity}
                      </Text>
                    </View>
                    <Text className="text-gray-900 font-semibold">
                      {formatPrice(concession.total_price)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Price Breakdown */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600">Tiền vé</Text>
                <Text className="text-gray-900">
                  {formatPrice(ticketData.seat_total_price)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600">Tiền đồ ăn</Text>
                <Text className="text-gray-900">
                  {formatPrice(ticketData.concession_total_price)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center pt-2 border-t border-gray-200">
                <Text className="text-lg font-bold text-gray-900">
                  Tổng cộng
                </Text>
                <Text className="text-lg font-bold text-blue-600">
                  {formatPrice(ticketData.total_price)}
                </Text>
              </View>
            </View>
          </View>

          {/* QR Code Section */}
          {/* <View className="bg-gray-50 p-4 items-center">
            <View className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 items-center justify-center mb-2">
              <Ionicons name="qr-code-outline" size={48} color="#6b7280" />
            </View>
            <Text className="text-gray-500 text-sm text-center">
              Mã vé: {ticketData.id.substring(0, 8).toUpperCase()}
            </Text>
          </View> */}
        </View>

        {/* Action Buttons */}
        <View className="flex-row mx-4 mt-4 mb-6 space-x-3">
          <TouchableOpacity
            className="flex-1 bg-blue-600 rounded-xl py-4 items-center"
            onPress={handlePayment}
          >
            <Text className="text-white font-semibold text-base">
              Thanh toán ngay
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TicketScreen

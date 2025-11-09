import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ConcessionItem } from '../types/item'
import { ConcessionSelection } from '../types/concession'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { RootState } from '../redux/store'
import { getAllItems } from '../redux/Items/concessionItemsActions'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MovieStackParamList } from '../navigation/MovieStack'
import { createTicket } from '../redux/Ticket/ticketActions'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'

interface ConcessionMenuProps {}

const ConcessionMenu: React.FC<ConcessionMenuProps> = () => {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {}
  )
  type MovieShowtimeRouteProp = RouteProp<
    MovieStackParamList,
    'ConcessionItems'
  >
  const route = useRoute<MovieShowtimeRouteProp>()
  const { bookingIds, seat_total_price } = route.params
  const dispatch = useAppDispatch()
  const { concessionItemsList, loading } = useAppSelector(
    (state: RootState) => state.concessionItems
  )
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  useEffect(() => {
    dispatch(getAllItems())
  }, [dispatch])

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(typeof price === 'string' ? parseFloat(price) : price)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'snack':
        return 'fast-food-outline'
      case 'drink':
        return 'wine-outline'
      case 'combo':
        return 'bag-outline'
      default:
        return 'restaurant-outline'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'snack':
        return 'bg-orange-100 text-orange-600'
      case 'drink':
        return 'bg-blue-100 text-blue-600'
      case 'combo':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'snack':
        return 'Đồ ăn vặt'
      case 'drink':
        return 'Nước uống'
      case 'combo':
        return 'Combo'
      default:
        return 'Khác'
    }
  }

  const updateQuantity = (
    itemId: string,
    change: number,
    item: ConcessionItem
  ) => {
    const newQuantity = Math.max(0, (selectedItems[itemId] || 0) + change)
    const updatedItems = { ...selectedItems }

    if (newQuantity === 0) {
      delete updatedItems[itemId]
    } else {
      updatedItems[itemId] = newQuantity
    }

    setSelectedItems(updatedItems)
  }

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = concessionItemsList.find((item) => item.id === itemId)
      return total + (item ? quantity * parseFloat(item.price) : 0)
    }, 0)
  }

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce(
      (total, quantity) => total + quantity,
      0
    )
  }

  const handlePayment = async () => {
    const totalPrice = getTotalPrice()
    const data = {
      seat_total_price: seat_total_price,
      concession_total_price: totalPrice,
      seat_booking_ids: bookingIds,
      concessions: Object.entries(selectedItems).length
        ? Object.entries(selectedItems).map(([item_id, quantity]) => ({
            item_id,
            quantity
          }))
        : [] // gửi mảng rỗng nếu không chọn gì
    }
    const result = await dispatch(createTicket(data))
    const ticket_id = result.id
    navigation.navigate('Movie', {
      screen: 'Ticket',
      params: {
        ticket_id
      }
    })
  }

  const renderConcessionItem = ({ item }: { item: ConcessionItem }) => {
    const quantity = selectedItems[item.id] || 0
    return (
      <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        <View className="flex-row p-4">
          {/* Image */}
          <View className="mr-4">
            <Image
              source={{ uri: item.image_url }}
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />
            {/* Category Badge */}
            <View
              className={`absolute -top-2 -right-2 px-2 py-1 rounded-full ${getCategoryColor(
                item.category
              )}`}
            >
              <Ionicons
                name={getCategoryIcon(item.category) as any}
                size={12}
                color={
                  item.category === 'snack'
                    ? '#ea580c'
                    : item.category === 'drink'
                    ? '#2563eb'
                    : '#9333ea'
                }
              />
            </View>
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-500 mb-2">
                  {getCategoryName(item.category)}
                </Text>
                <Text className="text-lg font-bold text-blue-600">
                  {formatPrice(item.price)}
                </Text>
              </View>
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, -1, item)}
                  className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                  disabled={quantity === 0}
                >
                  <Ionicons
                    name="remove"
                    size={18}
                    color={quantity === 0 ? '#9ca3af' : '#374151'}
                  />
                </TouchableOpacity>

                <Text className="mx-4 text-lg font-semibold text-gray-900 min-w-[24px] text-center">
                  {quantity}
                </Text>

                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, 1, item)}
                  className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center"
                >
                  <Ionicons name="add" size={18} color="white" />
                </TouchableOpacity>
              </View>

              {quantity > 0 && (
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 font-semibold text-sm">
                    {formatPrice(quantity * parseFloat(item.price))}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          Đồ ăn & Nước uống
        </Text>
        <Text className="text-gray-500">Chọn combo và đồ uống yêu thích</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500">Đang tải dữ liệu...</Text>
        </View>
      ) : concessionItemsList.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500">Không có món ăn nào</Text>
        </View>
      ) : (
        <FlatList
          data={concessionItemsList}
          renderItem={renderConcessionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Summary */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-600 text-sm">
              {getTotalItems()} món đã chọn
            </Text>
            <Text className="text-2xl font-bold text-gray-900">
              {formatPrice(getTotalPrice())}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-full"
            onPress={() => {
              Alert.alert(
                'Đã thêm vào giỏ hàng',
                `Bạn đã chọn ${getTotalItems()} món với tổng giá ${formatPrice(
                  getTotalPrice()
                )}`
              )
            }}
          >
            <Text
              className="text-white font-semibold text-base"
              onPress={() => handlePayment()}
            >
              Chọn mua
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ConcessionMenu

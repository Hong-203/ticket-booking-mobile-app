import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'

interface SnackItem {
  id: string
  name: string
  description: string
  price: string
  image_url: string
  category: string
}

interface SnackListProps {
  data?: SnackItem[]
}

const SnackList: React.FC<SnackListProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View className="items-center mt-8">
        <Text className="text-white">Không có dữ liệu món ăn.</Text>
      </View>
    )
  }

  return (
    <>
      {/* Header */}
      <View className="px-4 mb-4 items-center">
        <Text className="text-2xl font-extrabold text-white mb-1 text-center">
          Đồ ăn & Thức uống
        </Text>
        <Text className="text-sm text-gray-300 text-center font-medium">
          Gọi món nhanh – trải nghiệm phim trọn vẹn hơn!
        </Text>
      </View>
      <View className="bg-white/80 rounded-2xl mx-4 mt-6 py-4">
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row items-center px-4 py-3 border-b border-gray-200"
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.image_url }}
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1 ml-4">
              <Text className="text-base font-bold text-gray-900 mb-1">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-600 mb-1" numberOfLines={2}>
                {item.description}
              </Text>
              <Text className="text-sm font-semibold text-red-600">
                {Number(item.price).toLocaleString('vi-VN')}₫
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  )
}

export default SnackList

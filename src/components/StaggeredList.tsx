import React from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'

interface ServiceItem {
  id: string
  title: string
  description: string
  imagePath: string
}

interface StaggeredListProps {
  data?: ServiceItem[]
}

const StaggeredList: React.FC<StaggeredListProps> = ({ data = [] }) => {
  const sampleData: ServiceItem[] = [
    {
      id: '1',
      title: 'Dolby Atmos Sound',
      description: 'Âm thanh vòm chất lượng cao cho trải nghiệm đắm chìm.',
      imagePath:
        'https://static.doanhnhan.vn/images/upload/quynhchi/12042020/cgv-rap.jpg'
    },
    {
      id: '2',
      title: 'IMAX Experience',
      description: 'Màn hình siêu lớn, hình ảnh sắc nét và âm thanh mạnh mẽ.',
      imagePath:
        'https://static.doanhnhan.vn/images/upload/quynhchi/12042020/cgv-rap.jpg'
    },
    {
      id: '3',
      title: '4DX Motion Seats',
      description:
        'Ghế chuyển động, hiệu ứng gió, nước và mùi hương sống động.',
      imagePath:
        'https://static.doanhnhan.vn/images/upload/quynhchi/12042020/cgv-rap.jpg'
    },
    {
      id: '4',
      title: 'VIP Lounge',
      description: 'Ghế nằm cao cấp, dịch vụ sang trọng và tiện nghi riêng.',
      imagePath:
        'https://static.doanhnhan.vn/images/upload/quynhchi/12042020/cgv-rap.jpg'
    }
  ]

  const items = data.length > 0 ? data : sampleData

  const renderItem = (item: ServiceItem, index: number) => {
    const isEven = index % 2 === 0

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.85}
        className="mb-6 px-4"
      >
        <View
          className={`flex-row items-start ${
            !isEven ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Image */}
          <Image
            source={{ uri: item.imagePath }}
            className="w-32 h-24 rounded-xl"
            resizeMode="cover"
          />

          {/* Text */}
          <View className={`flex-1 ${isEven ? 'ml-4' : 'mr-4'}`}>
            <Text
              className={`text-base font-bold text-black mb-2 ${
                !isEven ? 'text-right' : 'text-left'
              }`}
            >
              {item.title}
            </Text>
            <Text
              className={`text-sm text-gray-800 ${
                !isEven ? 'text-right' : 'text-left'
              }`}
            >
              {item.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 20 }}
    >
      {/* Header */}
      <View className="px-4 mb-4 items-center">
        <Text className="text-2xl font-extrabold text-white mb-1 text-center">
          Dịch vụ đặc biệt
        </Text>
        <Text className="text-sm text-gray-300 text-center font-medium">
          Khám phá những trải nghiệm điện ảnh tuyệt vời
        </Text>
      </View>

      {/* Item List */}
      <View className="bg-white/80 rounded-2xl mx-4 py-4 shadow-lg shadow-black/30">
        {items.map(renderItem)}
        <View className="px-4 mt-4">
          <Text className="text-center text-red-600 text-xs italic">
            Còn nhiều dịch vụ hấp dẫn khác đang chờ bạn khám phá!
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default StaggeredList

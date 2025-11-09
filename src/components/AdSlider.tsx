import React, { useRef } from 'react'
import { View, Image, Dimensions, Animated, ScrollView } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')
const itemWidth = screenWidth * 0.8
const sideSpacing = (screenWidth - itemWidth) / 2

const AdSlider: React.FC = () => {
  const scrollX = useRef(new Animated.Value(0)).current

  const banners: string[] = [
    'https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/m/m/mmp_promote_980x448_up.jpg',
    'https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/h/d/hdg_payoff_980x448.jpg',
    'https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_16_.jpg',
    'https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980wx448h-min_18.jpg',
    'https://iguov8nhvyobj.vcdn.cloud/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_17__2.jpg'
  ]

  return (
    <View className="my-4">
      <Animated.ScrollView
        horizontal
        snapToInterval={itemWidth + 10}
        decelerationRate={0.9}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: sideSpacing
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => {
          const inputRange = [
            (index - 1) * (itemWidth + 10),
            index * (itemWidth + 10),
            (index + 1) * (itemWidth + 10)
          ]

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp'
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp'
          })

          return (
            <Animated.View
              key={index}
              style={{
                width: itemWidth,
                marginHorizontal: 5,
                transform: [{ scale }],
                opacity
              }}
            >
              <Image
                source={{ uri: banner }}
                style={{ width: '100%', height: 120, borderRadius: 12 }}
                resizeMode="cover"
              />
            </Animated.View>
          )
        })}
      </Animated.ScrollView>
    </View>
  )
}

export default AdSlider

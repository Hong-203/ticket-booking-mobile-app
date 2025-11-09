import React from 'react'
import { View } from 'react-native'
import Header from './Header'

type ScreenLayoutProps = React.PropsWithChildren<{
  showHeader?: boolean
  activeTab?: 'now_showing' | 'coming_soon'
  setActiveTab?: (value: 'now_showing' | 'coming_soon') => void
}>

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  showHeader = true,
  activeTab = 'now_showing',
  setActiveTab = () => {}
}) => {
  return (
    <View className="flex-1">
      {showHeader && (
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {children}
    </View>
  )
}

export default ScreenLayout

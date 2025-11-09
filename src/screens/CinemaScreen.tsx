import React, { useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { getAllTheatre } from '../redux/Theatre/theatreActions'
import { useAppDispatch } from '../redux/hooks'

const { width } = Dimensions.get('window')

interface Theatre {
  id: string
  name: string
  slug_name: string
  location: string
  slug_location: string
  locationDetails: string
  created_at: string
  updated_at: string
}

const CinemaScreen: React.FC = () => {
  const dispatch = useAppDispatch()

  const { theatreList, loading } = useSelector(
    (state: RootState) => state.theatre
  )

  useEffect(() => {
    dispatch(getAllTheatre())
  }, [dispatch])

  // Group by location
  const groupedByLocation = theatreList.reduce((acc, cinema) => {
    const { location } = cinema
    if (!acc[location]) acc[location] = []
    acc[location].push(cinema)
    return acc
  }, {} as Record<string, Theatre[]>)

  const handleCinemaPress = (cinema: Theatre) => {
    // Handle cinema selection
    console.log('Selected cinema:', cinema.name)
  }

  const renderCinemaCard = (cinema: Theatre) => (
    <TouchableOpacity
      key={cinema.id}
      style={styles.cinemaCard}
      onPress={() => handleCinemaPress(cinema)}
      activeOpacity={0.7}
    >
      <View style={styles.cinemaHeader}>
        <View style={styles.cinemaIcon}>
          <Text style={styles.cinemaIconText}>🎬</Text>
        </View>
        <View style={styles.cinemaInfo}>
          <Text style={styles.cinemaName}>{cinema.name}</Text>
          <Text style={styles.cinemaLocation}>{cinema.locationDetails}</Text>
        </View>
        <View style={styles.arrowIcon}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderLocationSection = ([location, cinemaList]: [
    string,
    Theatre[]
  ]) => (
    <View key={location} style={styles.locationSection}>
      <View style={styles.locationHeader}>
        <Text style={styles.locationTitle}>{location}</Text>
        <View style={styles.locationBadge}>
          <Text style={styles.locationBadgeText}>{cinemaList.length}</Text>
        </View>
      </View>
      <View style={styles.cinemaList}>{cinemaList.map(renderCinemaCard)}</View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rạp Chiếu Phim</Text>
        <Text style={styles.headerSubtitle}>Chọn rạp gần bạn nhất</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Đang tải danh sách rạp...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {Object.entries(groupedByLocation).map(renderLocationSection)}

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '400'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 20
  },
  locationSection: {
    marginBottom: 32
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16
  },
  locationTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#343A40',
    flex: 1
  },
  locationBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 32,
    alignItems: 'center'
  },
  locationBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  cinemaList: {
    paddingHorizontal: 20
  },
  cinemaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  },
  cinemaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  cinemaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  cinemaIconText: {
    fontSize: 20
  },
  cinemaInfo: {
    flex: 1
  },
  cinemaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4
  },
  cinemaLocation: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20
  },
  arrowIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowText: {
    fontSize: 24,
    color: '#DEE2E6',
    fontWeight: '300'
  },
  bottomSpacing: {
    height: 40
  }
})

export default CinemaScreen

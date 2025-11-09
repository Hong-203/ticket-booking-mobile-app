import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking
} from 'react-native'
import {
  Play,
  Star,
  Calendar,
  Clock,
  User,
  Film,
  MapPin,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MovieStackParamList } from '../navigation/MovieStack'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getAllShownIn } from '../redux/ShownIn/shownInActions'
import { RootState } from '../redux/store'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'

// Types
interface Movie {
  id: string
  name: string
  slug: string
  image_path: string
  language: string
  synopsis: string
  rating: string
  duration: string
  top_cast: string
  release_date: string
  trailer_url: string
  created_at: string
  updated_at: string
}

interface Showtime {
  id: string
  movie_start_time: string
  show_type: string
  showtime_date: string
  price_per_seat: number
  created_at: string
  updated_at: string
}

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

interface Hall {
  id: string
  name: string
  totalSeats: number
  created_at: string
  updated_at: string
  theatre: Theatre
}

interface ShowtimeData {
  movie_id: string
  showtime_id: string
  hall_id: string
  movie: Movie
  showtime: Showtime
  hall: Hall
  created_at: string
  updated_at: string
}

interface Location {
  location: string
  slug_location: string
}

interface LocationFilterProps {
  locations: Location[]
  selectedLocation: string
  onLocationSelect: (location: string) => void
  isOpen: boolean
  onToggle: () => void
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  isOpen,
  onToggle
}) => {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity onPress={onToggle} style={styles.filterButton}>
        <View style={styles.filterButtonContent}>
          <MapPin size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
          <Text style={styles.filterButtonText}>
            {selectedLocation || 'Chọn khu vực'}
          </Text>
        </View>
        <ChevronDown
          size={16}
          color="#9CA3AF"
          style={{
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }]
          }}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => {
              onLocationSelect('')
              onToggle()
            }}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownItemText}>Tất cả khu vực</Text>
          </TouchableOpacity>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.slug_location}
              onPress={() => {
                onLocationSelect(location.location)
                onToggle()
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{location.location}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}
type MovieShowtimeRouteProp = RouteProp<MovieStackParamList, 'MovieShowtime'>
const MovieShowtimeScreen: React.FC = () => {
  const route = useRoute<MovieShowtimeRouteProp>()
  const dispatch = useAppDispatch()
  const { slug } = route.params

  const { shownInList: showtimeData, loading } = useAppSelector(
    (state: RootState) => state.shownIn
  )
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] =
    useState<boolean>(false)

  useEffect(() => {
    fetchShowtimeData()
  }, [slug])

  const fetchShowtimeData = () => {
    if (slug) {
      dispatch(getAllShownIn(`slug_name=${slug}`))
    }
  }
  // Trích xuất danh sách các location không trùng nhau
  const locations: Location[] = React.useMemo(() => {
    const uniqueLocations = new Map<string, string>()
    showtimeData.forEach((item) => {
      const loc = item.hall.theatre.location
      const slugLoc = item.hall.theatre.slug_location
      if (!uniqueLocations.has(loc)) {
        uniqueLocations.set(loc, slugLoc)
      }
    })
    return Array.from(uniqueLocations.entries()).map(
      ([location, slug_location]) => ({
        location,
        slug_location
      })
    )
  }, [showtimeData])

  // Lọc dữ liệu theo location nếu có chọn
  const filteredData: ShowtimeData[] = React.useMemo(() => {
    return showtimeData.filter(
      (item) =>
        !selectedLocation || item.hall.theatre.location === selectedLocation
    )
  }, [showtimeData, selectedLocation])

  // Gom nhóm theo ngày
  const groupedByDate: Record<string, ShowtimeData[]> = React.useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const date = item.showtime.showtime_date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(item)
      return acc
    }, {} as Record<string, ShowtimeData[]>)
  }, [filteredData])

  const movie = showtimeData[0]?.movie

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + 'đ'
  }

  const handlePlayTrailer = (): void => {
    if (movie?.trailer_url) {
      Linking.openURL(movie.trailer_url)
    }
  }
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const handleBookTicket = (hall_id: string, showtime_id: string): void => {
    const movie_id = movie.id
    navigation.navigate('Movie', {
      screen: 'MovieBookingSeat',
      params: {
        movie_id: movie_id,
        hall_id: hall_id,
        showtime_id: showtime_id
      }
    })
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Movie Header */}
      <View style={styles.movieHeader}>
        <Image
          source={{ uri: movie.image_path }}
          style={styles.movieImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />

        <View style={styles.ratingBadge}>
          <Star size={16} color="white" fill="white" />
          <Text style={styles.ratingText}>{movie.rating}</Text>
        </View>

        <TouchableOpacity onPress={handlePlayTrailer} style={styles.playButton}>
          <Play size={24} color="white" fill="white" />
        </TouchableOpacity>
      </View>

      {/* Movie Info */}
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movie.name}</Text>

        <View style={styles.movieDetails}>
          <View style={styles.detailItem}>
            <Clock size={16} color="#9CA3AF" />
            <Text style={styles.detailText}>{movie.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <User size={16} color="#9CA3AF" />
            <Text style={styles.detailText}>{movie.rating}/10</Text>
          </View>
        </View>

        <Text style={styles.synopsis}>{movie.synopsis}</Text>

        {/* Location Filter */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Filter size={16} color="#9CA3AF" />
            <Text style={styles.filterTitle}>Lọc theo khu vực</Text>
          </View>
          <LocationFilter
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
            isOpen={isLocationDropdownOpen}
            onToggle={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          />
        </View>

        {/* Showtimes by Date */}
        <View style={styles.showtimesSection}>
          <Text style={styles.showtimesTitle}>Lịch chiếu</Text>

          {Object.keys(groupedByDate).map((date) => (
            <View key={date} style={styles.dateSection}>
              <View style={styles.dateHeader}>
                <Calendar size={16} color="#60A5FA" />
                <Text style={styles.dateTitle}>{formatDate(date)}</Text>
              </View>

              {/* Group by theatre */}
              {Object.values(
                groupedByDate[date].reduce((acc, item) => {
                  const theatreId = item.hall.theatre.id
                  if (!acc[theatreId]) {
                    acc[theatreId] = {
                      theatre: item.hall.theatre,
                      showtimes: []
                    }
                  }
                  acc[theatreId].showtimes.push(item)
                  return acc
                }, {} as Record<string, { theatre: Theatre; showtimes: ShowtimeData[] }>)
              ).map(({ theatre, showtimes }) => (
                <View key={theatre.id} style={styles.theatreSection}>
                  <TouchableOpacity>
                    <View style={styles.theatreHeader}>
                      <MapPin size={16} color="#9CA3AF" />
                      <View style={styles.theatreInfo}>
                        <Text style={styles.theatreName}>{theatre.name}</Text>
                        <Text style={styles.theatreLocation}>
                          {theatre.locationDetails}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.showtimesGrid}>
                      {showtimes.map((item) => (
                        <TouchableOpacity
                          key={item.showtime_id}
                          onPress={() =>
                            handleBookTicket(item.hall.id, item.showtime.id)
                          }
                          style={styles.showtimeButton}
                        >
                          <View style={styles.showtimeHeader}>
                            <Text style={styles.showtimeTime}>
                              {item.showtime.movie_start_time}
                            </Text>
                            <View style={styles.showTypeBadge}>
                              <Text style={styles.showTypeText}>
                                {item.showtime.show_type}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.showtimeDetails}>
                            <Text style={styles.hallInfo}>
                              {item.hall.name} • {item.hall.totalSeats} ghế
                            </Text>
                            <Text style={styles.price}>
                              {formatPrice(item.showtime.price_per_seat)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </View>

        {Object.keys(groupedByDate).length === 0 && (
          <View style={styles.emptyState}>
            <Film size={48} color="#6B7280" style={{ opacity: 0.5 }} />
            <Text style={styles.emptyStateText}>Không có lịch chiếu nào</Text>
            {selectedLocation && (
              <Text style={styles.emptyStateSubText}>
                tại khu vực {selectedLocation}
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default MovieShowtimeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827'
  },
  loadingText: {
    color: 'white',
    fontSize: 16
  },
  movieHeader: {
    position: 'relative',
    height: 256
  },
  movieImage: {
    width: '100%',
    height: '100%'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.3)'
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#EAB308',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4
  },
  playButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 25
  },
  movieInfo: {
    padding: 16
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8
  },
  movieDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  detailText: {
    color: '#D1D5DB',
    fontSize: 14,
    marginLeft: 4
  },
  synopsis: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24
  },
  filterSection: {
    marginBottom: 24
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  filterTitle: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8
  },
  filterContainer: {
    position: 'relative'
  },
  filterButton: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 160,
    zIndex: 10
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151'
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16
  },
  showtimesSection: {
    marginBottom: 24
  },
  showtimesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16
  },
  dateSection: {
    marginBottom: 24
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151'
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#60A5FA',
    marginLeft: 8
  },
  theatreSection: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  theatreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  theatreInfo: {
    marginLeft: 8
  },
  theatreName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  theatreLocation: {
    color: '#9CA3AF',
    fontSize: 14
  },
  showtimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  showtimeButton: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    marginBottom: 8
  },
  showtimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  showtimeTime: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18
  },
  showTypeBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  showTypeText: {
    color: 'white',
    fontSize: 12
  },
  showtimeDetails: {
    gap: 2
  },
  hallInfo: {
    color: '#D1D5DB',
    fontSize: 14
  },
  price: {
    color: '#FBBF24',
    fontWeight: '600',
    fontSize: 14
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16
  },
  emptyStateSubText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4
  }
})

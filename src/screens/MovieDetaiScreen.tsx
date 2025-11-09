import React, { useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking
} from 'react-native'
import { Play, Star, Calendar, Clock, User, Film } from 'lucide-react-native'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getMovieById } from '../redux/Movie/movieActions'
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import { MovieStackParamList } from '../navigation/MovieStack'
import { RootState } from '../redux/store'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'

const MovieDetailScreen: React.FC = () => {
  const dispatch = useAppDispatch()
  const { movieDetails, loading } = useAppSelector(
    (state: RootState) => state.movie
  )
  const route = useRoute<RouteProp<MovieStackParamList, 'MovieDetail'>>()
  const { id } = route.params
  useEffect(() => {
    dispatch(getMovieById(id))
  }, [id, dispatch])

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handlePlayTrailer = (): void => {
    if (movieDetails?.trailer_url) {
      Linking.openURL(movieDetails.trailer_url)
    }
  }
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handleBookingTicket = (): void => {
    if (movieDetails?.slug) {
      navigation.navigate('Movie', {
        screen: 'MovieShowtime',
        params: { slug: movieDetails.slug }
      })
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#111',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white' }}>Loading...</Text>
      </View>
    )
  }

  if (!movieDetails) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#111',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white' }}>Movie not found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#111' }}>
      <View style={{ height: 30, backgroundColor: 'black' }} />
      <View>
        <Image
          source={{ uri: movieDetails.image_path }}
          style={{ width: '100%', height: 400 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: '#facc15',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Star size={16} color="#fff" fill="#fff" />
          <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>
            {movieDetails.rating ?? 'N/A'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handlePlayTrailer}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#dc2626',
            padding: 12,
            borderRadius: 50
          }}
        >
          <Play size={24} color="#fff" fill="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 8
          }}
        >
          {movieDetails.name ?? 'Unknown Title'}
        </Text>

        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}
        >
          {movieDetails.genres?.map((genre, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#2563eb',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 16,
                marginRight: 8,
                marginBottom: 8
              }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>
                {genre.genre}
              </Text>
            </View>
          )) ?? <Text style={{ color: '#d1d5db' }}>No genres available</Text>}
        </View>

        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <Calendar size={20} color="#9ca3af" />
            <Text style={{ color: '#d1d5db', marginLeft: 8 }}>
              Release: {formatDate(movieDetails.release_date)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <Clock size={20} color="#9ca3af" />
            <Text style={{ color: '#d1d5db', marginLeft: 8 }}>
              Duration: {movieDetails.duration ?? 'N/A'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <User size={20} color="#9ca3af" />
            <Text style={{ color: '#d1d5db', marginLeft: 8 }}>
              Cast: {movieDetails.top_cast ?? 'N/A'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Film size={20} color="#9ca3af" />
            <Text style={{ color: '#d1d5db', marginLeft: 8 }}>
              Directors:{' '}
              {movieDetails.directors?.map((d) => d.director).join(', ') ??
                'N/A'}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 8
            }}
          >
            Synopsis
          </Text>
          <Text style={{ color: '#d1d5db', lineHeight: 22 }}>
            {movieDetails.synopsis ?? 'No synopsis available'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePlayTrailer}
          style={{
            backgroundColor: '#dc2626',
            padding: 16,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12
          }}
        >
          <Play size={20} color="white" fill="white" />
          <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>
            Watch Trailer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBookingTicket}
          style={{
            backgroundColor: '#dc2626',
            padding: 16,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12
          }}
        >
          <Play size={20} color="white" fill="white" />
          <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>
            Book Tickets
          </Text>
        </TouchableOpacity>

        <View
          style={{
            marginTop: 24,
            borderTopWidth: 1,
            borderTopColor: '#374151',
            paddingTop: 16
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text style={{ color: '#9ca3af' }}>Language:</Text>
              <Text style={{ color: 'white' }}>
                {movieDetails.language ?? 'N/A'}
              </Text>
            </View>
            <View>
              <Text style={{ color: '#9ca3af' }}>Rating:</Text>
              <Text style={{ color: 'white' }}>
                {movieDetails.rating ? `${movieDetails.rating}/10` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default MovieDetailScreen

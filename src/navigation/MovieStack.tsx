import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MovieDetailScreen from '../screens/MovieDetaiScreen'
import MovieShowtimeScreen from '../screens/MovieShowtimeScreen'
import CinemaBookingScreen from '../screens/CinemaBookingScreen'
import TicketScreen from '../screens/TicketScreen'
import ConcessionMenu from '../screens/ConcessionMenuScreen'
import PaymentScreen from '../screens/PaymentScreen'

export type MovieStackParamList = {
  MovieDetail: { id: string }
  MovieShowtime: { slug: string }
  MovieBookingSeat: { movie_id: string; hall_id: string; showtime_id: string }
  Ticket: { ticket_id: string }
  ConcessionItems: { bookingIds: string[]; seat_total_price: number }
  Payment: { ticket_id: string }
}

const Stack = createNativeStackNavigator<MovieStackParamList>()

const MovieStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen name="MovieShowtime" component={MovieShowtimeScreen} />
      <Stack.Screen name="MovieBookingSeat" component={CinemaBookingScreen} />
      <Stack.Screen name="Ticket" component={TicketScreen} />
      <Stack.Screen name="ConcessionItems" component={ConcessionMenu} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  )
}

export default MovieStack

import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './User/userSlice'
import { movieReducer } from './Movie/movieSlice'
import { concessionItemsReducer } from './Items/concessionItemsSlice'
import { theatreReducer } from './Theatre/theatreSlice'
import { shownInReducer } from './ShownIn/shownInSlice'
import { bookingReducer } from './Booking/bookingSlice'
import { showTimeReducer } from './ShowTime/showTimeSlice'
import { ticketReducer } from './Ticket/ticketSlice'
import { paymentReducer } from './Payment/paymentSlice'

export const store = configureStore({
  reducer: {
    users: userReducer,
    movie: movieReducer,
    concessionItems: concessionItemsReducer,
    theatre: theatreReducer,
    shownIn: shownInReducer,
    booking: bookingReducer,
    showTime: showTimeReducer,
    ticket: ticketReducer,
    payment: paymentReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

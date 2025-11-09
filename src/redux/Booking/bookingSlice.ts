import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Booking {
  id: string
  name: string
  description: string
  status: 'empty' | 'booked' | 'pending'
  created_at: string
  updated_at: string
  user_id: string | null
}

interface BookingState {
  bookingList: Booking[]
  bookingDetails: Booking[]
  loading: boolean
  error: string | null
  response: string | null
}

const initialState: BookingState = {
  bookingList: [],
  bookingDetails: [],
  loading: false,
  error: null,
  response: null
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    getRequest(state) {
      state.loading = true
    },
    doneSuccess(state, action: PayloadAction<Booking[]>) {
      state.bookingDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getBookingSuccess(state, action: PayloadAction<Booking[]>) {
      state.bookingList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getFailed(state, action: PayloadAction<string>) {
      state.response = action.payload
      state.loading = false
      state.error = null
    },
    getError(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    postDone(state) {
      state.loading = false
      state.error = null
      state.response = null
    },
    deleteSuccess(state, action: PayloadAction<string>) {
      state.bookingList = state.bookingList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess(state, action: PayloadAction<Booking>) {
      state.bookingList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess(state, action: PayloadAction<Booking>) {
      const index = state.bookingList.findIndex(
        (item) => item.user_id === action.payload.user_id
      )
      if (index !== -1) {
        state.bookingList[index] = action.payload
      }
      state.loading = false
      state.error = null
      state.response = 'Updated successfully'
    }
  }
})

export const {
  getRequest,
  doneSuccess,
  getBookingSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess
} = bookingSlice.actions

export const bookingReducer = bookingSlice.reducer

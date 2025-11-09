import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ShowTime } from '../../types/showtime'

interface ShowTimeState {
  showTimesList: ShowTime[]
  showtimeDetails: ShowTime | null
  loading: boolean
  error: string | null
  response: string | null
}

const initialState: ShowTimeState = {
  showTimesList: [],
  showtimeDetails: null,
  loading: false,
  error: null,
  response: null
}

const showTimeSlice = createSlice({
  name: 'showtime',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action: PayloadAction<ShowTime>) => {
      state.showtimeDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSuccess: (state, action: PayloadAction<ShowTime[]>) => {
      state.showTimesList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getFailed: (state, action: PayloadAction<string>) => {
      state.response = action.payload
      state.loading = false
      state.error = null
    },
    getError: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    postDone: (state) => {
      state.loading = false
      state.error = null
      state.response = null
    },
    deleteSuccess: (state, action: PayloadAction<string>) => {
      state.showTimesList = state.showTimesList.filter(
        (item) => item.id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action: PayloadAction<ShowTime>) => {
      state.showTimesList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action: PayloadAction<ShowTime>) => {
      const index = state.showTimesList.findIndex(
        (item) => item.id === action.payload.id
      )
      if (index !== -1) {
        state.showTimesList[index] = action.payload
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
  getSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess
} = showTimeSlice.actions

export const showTimeReducer = showTimeSlice.reducer

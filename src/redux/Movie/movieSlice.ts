// redux/movieSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Movie, Seat } from '../../types/movie'

interface MovieState {
  movieList: Movie[]
  movieDetails: Movie | null
  loading: boolean
  error: string | null
  response: string | null
  total: number | null
  page: number | null
  limit: number | null
  seatList: Seat[]
  totalPages: number | null
}

const initialState: MovieState = {
  movieList: [],
  seatList: [],
  movieDetails: null,
  loading: false,
  error: null,
  response: null,
  total: null,
  page: null,
  limit: null,
  totalPages: null
}

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneDtSuccess: (state, action: PayloadAction<Movie>) => {
      state.movieDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSeatSuccess: (state, action: PayloadAction<Seat[]>) => {
      state.seatList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getMovieSuccess: (
      state,
      action: PayloadAction<{
        data: Movie[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    ) => {
      state.movieList = action.payload.data
      state.total = action.payload.total
      state.page = action.payload.page
      state.limit = action.payload.limit
      state.totalPages = action.payload.totalPages
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
      state.movieList = state.movieList.filter(
        (item) => item.id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action: PayloadAction<Movie>) => {
      state.movieList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action: PayloadAction<Movie>) => {
      const index = state.movieList.findIndex(
        (item) => item.id === action.payload.id
      )
      if (index !== -1) {
        state.movieList[index] = action.payload
      }
      state.loading = false
      state.error = null
      state.response = 'Updated successfully'
    }
  }
})

export const {
  getRequest,
  doneDtSuccess,
  getMovieSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess,
  getSeatSuccess
} = movieSlice.actions

export const movieReducer = movieSlice.reducer

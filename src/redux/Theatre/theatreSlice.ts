import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Theatre {
  id: string
  name: string
  slug_name: string
  location: string
  slug_location: string
  locationDetails: string
  created_at: string
  updated_at: string
  user_id?: string // tùy theo API có trả hay không
}

interface TheatreState {
  theatreList: Theatre[]
  theatreDetails: Theatre[]
  theatreByLocation: Theatre[]
  listLocation: string[]
  loading: boolean
  error: string | null
  response: string | null
}

const initialState: TheatreState = {
  theatreList: [],
  theatreDetails: [],
  theatreByLocation: [],
  listLocation: [],
  loading: false,
  error: null,
  response: null
}

const theatreSlice = createSlice({
  name: 'theatre',
  initialState,
  reducers: {
    getRequest(state) {
      state.loading = true
    },
    doneSuccess(state, action: PayloadAction<Theatre[]>) {
      state.theatreDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSuccess(state, action: PayloadAction<Theatre[]>) {
      state.theatreList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getLocation(state, action: PayloadAction<string[]>) {
      state.listLocation = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getTheatreByLocation(state, action: PayloadAction<Theatre[]>) {
      state.theatreByLocation = action.payload
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
      state.theatreList = state.theatreList.filter(
        (item) => item.id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess(state, action: PayloadAction<Theatre>) {
      state.theatreList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess(state, action: PayloadAction<Theatre>) {
      const index = state.theatreList.findIndex(
        (item) => item.id === action.payload.id
      )
      if (index !== -1) {
        state.theatreList[index] = action.payload
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
  getLocation,
  getTheatreByLocation,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess
} = theatreSlice.actions

export const theatreReducer = theatreSlice.reducer

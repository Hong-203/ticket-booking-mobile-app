// shownInSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ShownIn, ShownInState } from '../../types/shownIn'

const initialState: ShownInState = {
  shownInList: [],
  shownInDetails: null,
  loading: false,
  error: null,
  response: null
}

const shownInSlice = createSlice({
  name: 'shownin',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action: PayloadAction<ShownIn>) => {
      state.shownInDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSTSuccess: (state, action: PayloadAction<ShownIn[]>) => {
      state.shownInList = action.payload
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
    createSuccess: (state, action: PayloadAction<ShownIn>) => {
      state.shownInList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    }
  }
})

export const {
  getRequest,
  doneSuccess,
  getSTSuccess,
  getFailed,
  getError,
  postDone,
  createSuccess
} = shownInSlice.actions

export const shownInReducer = shownInSlice.reducer

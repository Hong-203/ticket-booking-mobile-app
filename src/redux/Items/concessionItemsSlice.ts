import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConcessionItem } from '../../types/item'

interface ConcessionItemsState {
  concessionItemsList: ConcessionItem[]
  concessionItemsDetails: ConcessionItem | null
  loading: boolean
  error: string | null
  response: string | null
}

const initialState: ConcessionItemsState = {
  concessionItemsList: [],
  concessionItemsDetails: null,
  loading: false,
  error: null,
  response: null
}

const concessionItemsSlice = createSlice({
  name: 'concession-items',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    getItemSuccess: (state, action: PayloadAction<ConcessionItem[]>) => {
      state.concessionItemsList = action.payload
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
    doneSuccess: (state, action: PayloadAction<ConcessionItem>) => {
      state.concessionItemsDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    createSuccess: (state, action: PayloadAction<ConcessionItem>) => {
      state.concessionItemsList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action: PayloadAction<ConcessionItem>) => {
      const index = state.concessionItemsList.findIndex(
        (item) => item.id === action.payload.id
      )
      if (index !== -1) {
        state.concessionItemsList[index] = action.payload
      }
      state.loading = false
      state.error = null
      state.response = 'Updated successfully'
    },
    deleteSuccess: (state, action: PayloadAction<string>) => {
      state.concessionItemsList = state.concessionItemsList.filter(
        (item) => item.id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    }
  }
})

export const {
  getRequest,
  getItemSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
  createSuccess,
  updateSuccess,
  deleteSuccess
} = concessionItemsSlice.actions

export const concessionItemsReducer = concessionItemsSlice.reducer

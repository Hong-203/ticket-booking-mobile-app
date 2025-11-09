import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Payment {
  user_id: string
  [key: string]: any
}

interface PaymentState {
  payList: Payment[]
  payDetails: any[]
  loading: boolean
  error: string | null
  response: string | null
}

const initialState: PaymentState = {
  payList: [],
  payDetails: [],
  loading: false,
  error: null,
  response: null
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action: PayloadAction<any[]>) => {
      state.payDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getPaySuccess: (state, action: PayloadAction<Payment[]>) => {
      state.payList = action.payload
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
      state.payList = state.payList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createPaySuccess: (state, action: PayloadAction<Payment>) => {
      if (!Array.isArray(state.payList)) {
        state.payList = []
      }
      state.payList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action: PayloadAction<Payment>) => {
      if (Array.isArray(state.payList)) {
        const index = state.payList.findIndex(
          (item) => item.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.payList[index] = action.payload
        }
      } else {
        console.warn('payList is not an array!', state.payList)
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
  getPaySuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createPaySuccess,
  updateSuccess
} = paymentSlice.actions

export const paymentReducer = paymentSlice.reducer

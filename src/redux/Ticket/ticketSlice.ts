import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TicketData } from '../../types/ticket'

interface TicketState {
  ticketList: TicketData[]
  ticketDetails: TicketData | null
  loading: boolean
  error: string | null
  response: string | null
}

const initialState: TicketState = {
  ticketList: [],
  ticketDetails: null,
  loading: false,
  error: null,
  response: null
}

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneTicketSuccess: (state, action: PayloadAction<TicketData>) => {
      state.ticketDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getTicketSuccess: (state, action: PayloadAction<TicketData[]>) => {
      state.ticketList = action.payload
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
      state.ticketList = state.ticketList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action: PayloadAction<TicketData>) => {
      state.ticketList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action: PayloadAction<TicketData>) => {
      const index = state.ticketList.findIndex(
        (item) => item.user_id === action.payload.user_id
      )
      if (index !== -1) {
        state.ticketList[index] = action.payload
      }
      state.loading = false
      state.error = null
      state.response = 'Updated successfully'
    }
  }
})

export const {
  getRequest,
  doneTicketSuccess,
  getTicketSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess
} = ticketSlice.actions

export const ticketReducer = ticketSlice.reducer

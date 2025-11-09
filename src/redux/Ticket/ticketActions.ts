import axios from '../customAxios'
import { Dispatch } from 'redux'
import {
  createSuccess,
  doneTicketSuccess,
  getError,
  getFailed,
  getRequest
} from './ticketSlice'
import { getAuthConfig } from '../authConfig'

export const getTicketById =
  (ticketId: string) => async (dispatch: Dispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.get(`/tickets/${ticketId}`, config)
      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(doneTicketSuccess(res.data))
      }
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

export const createTicket = (data: any) => async (dispatch: Dispatch) => {
  dispatch(getRequest())
  try {
    const config = await getAuthConfig()
    const res = await axios.post('/tickets', data, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(createSuccess(res.data))
      return res.data
    }
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}

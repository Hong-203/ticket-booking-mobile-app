import axios from '../customAxios'
import {
  createSuccess,
  deleteSuccess,
  doneSuccess,
  getBookingSuccess,
  getError,
  getFailed,
  getRequest,
  postDone,
  updateSuccess
} from './bookingSlice'
import { getAuthConfig } from '../authConfig'
import { AppDispatch } from '../store'
import { Booking } from './bookingSlice'

export const getBookingAvailable =
  (query = '') =>
  async (dispatch: AppDispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.get(
        `/seats/available${query ? `?${query}` : ''}`,
        config
      )

      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(getBookingSuccess(res.data))
      }
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

export const createBooking =
  (data: any) =>
  async (dispatch: AppDispatch): Promise<any> => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.post('/seats/seat-booking', data, config)

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

// DELETE a booking by user_id
export const deleteBooking =
  (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      await axios.delete(`/seats/${userId}`, config)
      dispatch(deleteSuccess(userId))
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

// UPDATE a booking
export const updateBooking =
  (data: Booking) => async (dispatch: AppDispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.put(`/seats/${data.id}`, data, config)

      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(updateSuccess(res.data))
      }
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

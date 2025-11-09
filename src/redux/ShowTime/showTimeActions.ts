import { Dispatch } from 'redux'
import axios from '../customAxios'
import {
  createSuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getSuccess,
  postDone,
  updateSuccess
} from './showTimeSlice'
import { getAuthConfig } from '../authConfig'
import { ShowTime } from '../../types/showtime'

export const getAllShowTime = () => async (dispatch: Dispatch) => {
  dispatch(getRequest())
  try {
    const config = await getAuthConfig()
    const res = await axios.get<ShowTime[]>('/showtimes', config)
    if (res.data && 'message' in res.data) {
      dispatch(getFailed((res.data as any).message))
    } else {
      dispatch(getSuccess(res.data))
    }
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}

export const updateShowTime =
  (id: string, hallData: Partial<ShowTime>) => async (dispatch: Dispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.patch<ShowTime>(
        `/showtimes/${id}`,
        hallData,
        config
      )
      if (res.data && 'message' in res.data) {
        dispatch(getFailed((res.data as any).message))
      } else {
        dispatch(updateSuccess(res.data))
      }
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

export const deleteShowTime = (id: string) => async (dispatch: Dispatch) => {
  dispatch(getRequest())
  try {
    const config = await getAuthConfig()
    const res = await axios.delete(`/showtimes/${id}`, config)
    if (res.data && 'message' in res.data) {
      dispatch(getFailed((res.data as any).message))
    } else {
      dispatch(deleteSuccess(id))
    }
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}

export const detailShowTime = (id: string) => async (dispatch: Dispatch) => {
  dispatch(getRequest())
  try {
    const config = await getAuthConfig()
    const res = await axios.get(`/showtimes/${id}`, config)
    if (res.data && 'message' in res.data) {
      dispatch(getFailed((res.data as any).message))
    } else {
      dispatch(doneSuccess(res.data))
    }
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}

export const createShowTime =
  (data: ShowTime) => async (dispatch: Dispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.post<ShowTime>('/showtimes', data, config)
      if (res.data && 'message' in res.data) {
        dispatch(getFailed((res.data as any).message))
      } else {
        dispatch(createSuccess(res.data))
      }
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

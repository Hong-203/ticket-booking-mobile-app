import { Dispatch } from 'redux'
import axios from '../customAxios'
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  createSuccess,
  updateSuccess,
  deleteSuccess,
  getLocation,
  getTheatreByLocation,
  postDone,
  doneSuccess
} from './theatreSlice'
import { getAuthConfig } from '../authConfig'

export const getAllTheatre = () => async (dispatch: Dispatch) => {
  dispatch(getRequest())
  try {
    const config = await getAuthConfig()
    const res = await axios.get('/theatre', config)
    if (res.data.message) dispatch(getFailed(res.data.message))
    else dispatch(getSuccess(res.data))
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}

export const getAllLocation = () => async (dispatch: Dispatch) => {
  dispatch(getRequest())
  try {
    const config = await getAuthConfig()
    const res = await axios.get('/theatre/locations', config)
    if (res.data.message) dispatch(getFailed(res.data.message))
    else dispatch(getLocation(res.data))
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}

export const theatreByLocation =
  (slug: string) => async (dispatch: Dispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.get(`/theatre/location/${slug}`, config)
      if (res.data.message) dispatch(getFailed(res.data.message))
      else dispatch(getTheatreByLocation(res.data))
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

export const createTheatre = (data: any) => async (dispatch: Dispatch) => {
  dispatch(getRequest())
  try {
    const config = await getAuthConfig()
    const res = await axios.post('/theatre', data, config)
    if (res.data.message) dispatch(getFailed(res.data.message))
    else dispatch(createSuccess(res.data))
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}

export const updateTheatre =
  (id: string, data: any) => async (dispatch: Dispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.patch(`/theatre/${id}`, data, config)
      if (res.data.message) dispatch(getFailed(res.data.message))
      else dispatch(updateSuccess(res.data))
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

export const deleteTheatre = (id: string) => async (dispatch: Dispatch) => {
  dispatch(getRequest())
  try {
    const config = await getAuthConfig()
    const res = await axios.delete(`/theatre/${id}`, config)
    if (res.data.message) dispatch(getFailed(res.data.message))
    else dispatch(deleteSuccess(res.data))
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}

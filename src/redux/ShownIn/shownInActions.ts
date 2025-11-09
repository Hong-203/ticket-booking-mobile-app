import axios from '../customAxios'
import {
  getRequest,
  getSTSuccess,
  getFailed,
  getError,
  postDone
} from './shownInSlice'
import { getAuthConfig } from '../authConfig'
import { AppDispatch } from '../store'
import { Alert } from 'react-native'
import { ShownIn } from '../../types/shownIn'

export const getAllShownIn =
  (query = '') =>
  async (dispatch: AppDispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.get(
        `/shown-in${query ? `?${query}` : ''}`,
        config
      )
      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(getSTSuccess(res.data))
      }
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }

export const createShownIn =
  (data: ShownIn) => async (dispatch: AppDispatch) => {
    dispatch(postDone())
    try {
      const config = await getAuthConfig()
      const res = await axios.post('/shown-in', data, config)
      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(getSTSuccess(res.data))
      }
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }
